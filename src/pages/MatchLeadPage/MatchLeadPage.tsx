import { ComissionBids } from '@/components/Comission/ComissionBids';
import { ObjectMatchCard } from '@/components/MatchCard/ObjectMatchCard';
import { MatchControls } from '@/components/MatchControls/MatchControls';
import { RealEstateObject } from '@/types/entity';
import { Match, MatchStatus, ObjectMatch } from '@/types/matching';
import { Spinner } from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MatchLeadPage.module.css';
import { matchLogStore } from '@/stores/matchLogStore';
import { observer } from 'mobx-react-lite';
import { ComissionModal } from '@/components/Comission/ComissionModal';
import { updateMatch, getMatchById, getMatchLogs } from '@/requests/matches';
import { userStore } from '@/stores/userStore';
import { objectMatchesStore } from '@/stores/matchesByEntitiesStore';
import { getEstateById } from '@/requests/entities';

enum MatchStatusEnum {
  OK,
  BIDS,
  WAIT_FOR_ANSWER,
  DECLINED,
}

const getMatchStatus = (match: Match) => {
  if (match?.leadStatus == 'UNDEFINED') {
    return MatchStatusEnum.WAIT_FOR_ANSWER;
  }

  if (
    (match?.leadStatus == 'COMMISSION' && match.estateStatus == 'ACCEPTED') ||
    (match.leadStatus == 'ACCEPTED' && match.estateStatus == 'COMMISSION')
  ) {
    return MatchStatusEnum.OK;
  }

  if (
    match?.leadStatus == 'DISLIKED' ||
    match.estateStatus == 'DISLIKED' ||
    match.leadStatus == 'DECLINED' ||
    match.estateStatus == 'DECLINED'
  ) {
    return MatchStatusEnum.DECLINED;
  }

  return MatchStatusEnum.BIDS;
};

const getActualComissionValues = (
  matchId: string,
  sourceEntity: RealEstateObject
): { objectUserComission?: number } => {
  const matchLogs = matchLogStore.getLogsByMatch(matchId);

  const result = {
    objectUserComission: sourceEntity.commissionShare,
  };

  if (!matchLogs) {
    return result;
  }

  const logs = matchLogs.slice().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const lastObject = logs.filter(log => log.userType == 'object').at(0);

  if (lastObject) {
    result.objectUserComission = lastObject.leadCommission;
  }

  return result;
};

export const MatchLeadPage: FC = observer(() => {
  const { id } = useParams<{ id: string }>();

  const [sourceEntity, setSourceEntity] = useState<RealEstateObject | null>(null);

  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const matchesStore = objectMatchesStore;

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const matchResp = await getMatchById(id);
        console.log({ matchResp });

        objectMatchesStore.putMatch(matchResp?.leadId, matchResp as ObjectMatch);

        const matchLogs = await getMatchLogs(id);

        console.log({ matchLogs });
        matchLogStore.setLogs(id, matchLogs || []);

        const object = await getEstateById(matchResp.estateId);

        console.log({object});

        if (!object) {
          return;
        }
        setSourceEntity(object);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading || !id) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!sourceEntity) {
    console.log('sourceEntity ==========');
    return (
      <div className={styles.notFoundContainer}>
        <p>Сущность не найдена</p>
      </div>
    );
  }

  const match = matchesStore.getMatchById(sourceEntity.id, id);

  if (!match) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Сущность не найдена</p>
      </div>
    );
  }

  const matchStatus = getMatchStatus(match);

  const otherStatus = match.leadStatus;

  const { objectUserComission } = getActualComissionValues(id, sourceEntity);

  const updateMatchAction = async (status: MatchStatus, commission: number) => {
    const match = await updateMatch({
      id: id,
      status: status,
      leadCommission: commission && 100 - commission,
      updatedBy: userStore.user!.id,
    });

    objectMatchesStore.putMatch(sourceEntity.id, match as ObjectMatch);
  };

  return (
    <>
      <ComissionModal
        onOpenChange={open => setIsComissionModalOpen(open)}
        open={isComissionModalOpen}
        onComissionSubmit={async comission => {
          updateMatchAction('COMMISSION', comission);
        }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          {/* <ObjectMatchCard
            data={sourceEntity as RealEstateObject}
            displayComission={matchStatus !== MatchStatusEnum.BIDS}
          /> */}

          {matchStatus === MatchStatusEnum.BIDS && (
            <ComissionBids
              yours={objectUserComission ?? sourceEntity.commissionShare}
              theirs={sourceEntity.commissionShare != null ? 100 - sourceEntity.commissionShare : 0}
            />
          )}
        </div>

        {matchStatus === MatchStatusEnum.OK && (
          <div className={styles.matchAccepted}>Успешный мэтч! Контакты риэлтора будут отправлены в сообщения Telegram бота.</div>
        )}

        {matchStatus === MatchStatusEnum.WAIT_FOR_ANSWER && <div className={styles.waitForAnswer}>Ждем ответа от риэлтора</div>}

        {matchStatus === MatchStatusEnum.DECLINED && <div className={styles.declined}>Риэлтор отказался от сделки</div>}

        {matchStatus === MatchStatusEnum.BIDS && (
          <MatchControls
            onLike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'ACCEPTED' : 'LIKED',
                objectUserComission || sourceEntity.commissionShare
              );
            }}
            onComission={() => setIsComissionModalOpen(true)}
            onDislike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'DECLINED' : 'DISLIKED',
                objectUserComission || sourceEntity.commissionShare
              );
            }}
          />
        )}
      </div>
    </>
  );
});
