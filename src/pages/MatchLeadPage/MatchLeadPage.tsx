import { ComissionBids } from '@/components/Comission/ComissionBids';
import { ObjectMatchCard } from '@/components/MatchCard/ObjectMatchCard';
import { MatchHistory } from '@/components/MatchHistory';
import { MatchControls } from '@/components/MatchControls/MatchControls';
import { RealEstateObject } from '@/types/entity';
import { Match, MatchStatus, ObjectMatch } from '@/types/matching';
import { Spinner } from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import styles from './MatchLeadPage.module.css';
import { matchLogStore } from '@/stores/matchLogStore';
import { observer } from 'mobx-react-lite';
import { ComissionModal } from '@/components/Comission/ComissionModal';
import { updateMatch, getMatchById, getMatchLogs } from '@/requests/matches';
import { objectMatchesStore } from '@/stores/matchesByEntitiesStore';
import { getEstateById } from '@/requests/entities';
import { useQuery, useMutation } from '@tanstack/react-query';

// Константы
const COMMISSION_TOTAL = 100;

// Хелперы
const getCommissionValues = (objectCommission: number, userCommission?: number) => {
  const yours = userCommission ?? objectCommission;
  const theirs = objectCommission != null ? COMMISSION_TOTAL - objectCommission : 0;
  return { yours, theirs };
};

const getStatusClassName = (status: MatchStatusEnum) => ({
  [styles.matchAccepted]: status === MatchStatusEnum.OK,
  [styles.waitForAnswer]: status === MatchStatusEnum.WAIT_FOR_ANSWER,
  [styles.declined]: status === MatchStatusEnum.DECLINED,
});

const getStatusMessage = (status: MatchStatusEnum) => {
  switch (status) {
    case MatchStatusEnum.OK:
      return {
        icon: <CheckCircle className={styles.statusIcon} size={20} />,
        text: 'Успешный мэтч! Контакты риэлтора будут отправлены в сообщения Telegram бота.'
      };
    case MatchStatusEnum.WAIT_FOR_ANSWER:
      return {
        icon: <Clock className={styles.statusIcon} size={20} />,
        text: 'Ждем ответа от риэлтора'
      };
    case MatchStatusEnum.DECLINED:
      return {
        icon: <XCircle className={styles.statusIcon} size={20} />,
        text: 'Риэлтор отказался от сделки'
      };
    default:
      return null;
  }
};


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

const getActualCommissionValues = (
  matchId: string,
  sourceEntity: RealEstateObject
): { objectUserCommission?: number } => {
  const matchLogs = matchLogStore.getLogsByMatch(matchId);

  const result = {
    objectUserCommission: sourceEntity.commissionShare,
  };

  if (!matchLogs) {
    return result;
  }

  const logs = matchLogs.slice().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const lastObject = logs.filter(log => log.userType == 'object').at(0);

  if (lastObject) {
    result.objectUserCommission = lastObject.leadCommission;
  }

  return result;
};

export const MatchLeadPage: FC = observer(() => {
  const { id } = useParams<{ id: string }>();

  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatchById(id!),
    enabled: !!id,
  });

  const { data: matchLogs, isLoading: matchLogsLoading } = useQuery({
    queryKey: ['matchLogs', id],
    queryFn: () => getMatchLogs(id!),
    enabled: !!id,
  });

  const { data: objectData, isLoading: objectLoading } = useQuery({
    queryKey: ['object', matchData?.estateId],
    queryFn: () => getEstateById(matchData!.estateId),
    enabled: !!matchData?.estateId,
  });

  const updateMatchMutation = useMutation({
    mutationFn: (params: { status: MatchStatus; commission: number }) => 
      updateMatch({
        id: id!,
        status: params.status,
        leadCommission: params.commission && COMMISSION_TOTAL - params.commission,
      }),
    onSuccess: (match) => {
      if (objectData) {
        objectMatchesStore.putMatch(objectData.id, match as ObjectMatch);
      }
    },
  });

  useEffect(() => {
    if (matchLogs && id) {
      matchLogStore.setLogs(id, matchLogs);
    }
  }, [matchLogs, id]);

  useEffect(() => {
    if (matchData) {
      objectMatchesStore.putMatch(matchData?.leadId, matchData as ObjectMatch);
    }
  }, [matchData]);

  const loading = matchLoading || objectLoading || matchLogsLoading;

  if (loading || !id) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!objectData) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Сущность объекта не найдена</p>
      </div>
    );
  }

  const match = matchData as ObjectMatch;

  if (!match) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Сущность мэтча не найдена</p>
      </div>
    );
  }

  const matchStatus = getMatchStatus(match);

  const otherStatus = match.leadStatus;

  const { objectUserCommission } = getActualCommissionValues(id, objectData);

  const updateMatchAction = async (status: MatchStatus, commission: number) => {
    updateMatchMutation.mutate({ status, commission });
  };

  const statusMessage = getStatusMessage(matchStatus);
  const commissionValues = getCommissionValues(objectData.commissionShare, objectUserCommission);
  const showControls = match.commonStatus === 'WAIT_ESTATE' || match.commonStatus === 'WAIT_LEAD';
  const showComissionBids = matchStatus === MatchStatusEnum.BIDS;

  console.log({ matchData });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <ObjectMatchCard
            data={objectData as RealEstateObject}
            displayComission={matchStatus !== MatchStatusEnum.BIDS}
          />

          <MatchHistory matchLogs={matchLogs || []} />

          {showComissionBids && (
            <ComissionBids
              yours={commissionValues.yours}
              theirs={commissionValues.theirs}
            />
          )}
        </div>

        {statusMessage && (
          <div className={classNames(styles.statusContent, getStatusClassName(matchStatus))}>
            {statusMessage.icon}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {showControls && (
          <MatchControls
            onLike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'ACCEPTED' : 'LIKED',
                objectUserCommission || objectData.commissionShare
              );
            }}
            onComission={() => setIsCommissionModalOpen(true)}
            onDislike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'DECLINED' : 'DISLIKED',
                objectUserCommission || objectData.commissionShare
              );
            }}
          />
        )}
      </div>

      <ComissionModal
        onOpenChange={open => setIsCommissionModalOpen(open)}
        open={isCommissionModalOpen}
        onComissionSubmit={async comission => {
          updateMatchAction('COMMISSION', comission);
        }}
      />
    </>
  );
});
