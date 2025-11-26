import { ComissionBids } from '@/components/Comission/ComissionBids';
import { LeadMatchCard } from '@/components/MatchCard/LeadMatchCard';
import { ObjectMatchCard } from '@/components/MatchCard/ObjectMatchCard';
import { MatchControls } from '@/components/MatchControls/MatchControls';
import { EntityType, Lead, RealEstateObject } from '@/types/entity';
import { Match, MatchStatus } from '@/types/matching';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MatchPage.css';
import { matchLogStore } from '@/stores/matchLogStore';
import { observer } from 'mobx-react-lite';
import { ComissionModal } from '@/components/Comission/ComissionModal';
import { updateMatch, getMatchById, getMatchLogs } from '@/requests/matches';
import { userStore } from '@/stores/userStore';
import { leadMatchesStore, objectMatchesStore } from '@/stores/matchesByEntitiesStore';
import { leadStore } from '@/stores/leadStore';
import { realEstateStore } from '@/stores/realEstateStore';

enum MatchStatusEnum {
  OK,
  BIDS,
  WAIT_FOR_ANSWER,
  DECLINED,
}

const getMatchStatus = (type: EntityType, match: Match) => {
  if (match?.leadStatus == 'UNDEFINED' && type == 'object') {
    return MatchStatusEnum.WAIT_FOR_ANSWER;
  }

  if (match?.estateStatus == 'UNDEFINED' && type == 'lead') {
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
  sourceEntity: Lead | RealEstateObject
): { leadUserComission?: number; objectUserComission?: number } => {
  const matchLogs = matchLogStore.getLogsByMatch(matchId);

  const result = {
    leadUserComission: sourceEntity.type === 'lead' ? sourceEntity.commissionShare : undefined,
    objectUserComission: sourceEntity.type === 'object' ? sourceEntity.commissionShare : undefined,
  };

  if (!matchLogs) {
    return result;
  }

  matchLogs.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const lastLead = matchLogs.filter(log => log.userType == 'lead').at(0);
  const lastObject = matchLogs.filter(log => log.userType == 'object').at(0);

  if (lastLead) {
    result.leadUserComission = lastLead.leadCommission;
  }

  if (lastObject) {
    result.objectUserComission = lastObject.leadCommission;
  }

  return result;
};

export const MatchPage: FC = observer(() => {
  const { type, id } = useParams<{
    type: EntityType;
    id: string;
  }>();

  const [sourceEntity, setSourceEntity] = useState<Lead | RealEstateObject | null>(null);

  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const matchesStore = type === 'lead' ? leadMatchesStore : objectMatchesStore;

  useEffect(() => {
    const loadData = async () => {
      if (!type || !id) return;

      setLoading(true);

      try {
        const matchResp = await getMatchById(id);

        matchesStore.putMatch(type === 'lead' ? matchResp?.leadId : matchResp?.estateId, matchResp);

        const matchLogs = await getMatchLogs(id);
        matchLogStore.setLogs(id, matchLogs || []);

        if (type === 'lead') {
          const lead = leadStore.getLeadById(matchResp!.leadId);
          if (!lead) {
            return;
          }
          setSourceEntity(lead);
        } else {
          const object = realEstateStore.getObjectById(matchResp!.estateId);
          if (!object) {
            return;
          }
          setSourceEntity(object);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, id]);

  if (loading || !id || !type) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!sourceEntity) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Сущность не найдена</p>
      </div>
    );
  }

  const match = matchesStore.getMatchById(sourceEntity.id, id);

  if (!match) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Сущность не найдена</p>
      </div>
    );
  }

  const matchStatus = getMatchStatus(type, match);

  const otherStatus = type === 'lead' ? match.estateStatus : match.leadStatus;

  const { leadUserComission, objectUserComission } = getActualComissionValues(id, sourceEntity);

  const otherUserComission = type === 'lead' ? objectUserComission : leadUserComission;

  const updateMatchAction = async (status: MatchStatus, commission: number) => {
    const match = await updateMatch({
      id: id,
      status: status,
      leadCommission: sourceEntity.type === 'lead' ? commission : commission && 100 - commission,
      updatedBy: userStore.user!.id,
    });

    matchesStore.putMatch(sourceEntity.id, match);
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

      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          {sourceEntity!.type === 'object' ? (
            <ObjectMatchCard
              data={sourceEntity as RealEstateObject}
              displayComission={matchStatus !== MatchStatusEnum.BIDS}
            />
          ) : (
            <LeadMatchCard data={sourceEntity as Lead} displayComission={matchStatus !== MatchStatusEnum.BIDS} />
          )}

          {matchStatus === MatchStatusEnum.BIDS && (
            <ComissionBids
              yours={sourceEntity.type === 'object' ? leadUserComission! : objectUserComission!}
              theirs={sourceEntity.type === 'lead' ? leadUserComission! : objectUserComission!}
            />
          )}
        </div>

        {matchStatus === MatchStatusEnum.OK && (
          <Button mode="filled" size="l" style={{ marginBottom: 12 }} onClick={() => {}}>
            Перейти в чат с риэлтором
          </Button>
        )}

        {matchStatus === MatchStatusEnum.WAIT_FOR_ANSWER && <div className="wait-for-answer">Ждем ответа от риэлтора</div>}

        {matchStatus === MatchStatusEnum.DECLINED && <div className="declined">Риэлтор отказался от сделки</div>}

        {matchStatus === MatchStatusEnum.BIDS && (
          <MatchControls
            onLike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'ACCEPTED' : 'LIKED',
                otherUserComission || sourceEntity.commissionShare
              );
            }}
            onComission={() => setIsComissionModalOpen(true)}
            onDislike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'DECLINED' : 'DISLIKED',
                otherUserComission || sourceEntity.commissionShare
              );
            }}
          />
        )}
      </div>
    </>
  );
});
