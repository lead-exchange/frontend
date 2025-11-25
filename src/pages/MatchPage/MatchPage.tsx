import { ComissionBids } from '@/components/Comission/ComissionBids';
import { LeadMatchCard } from '@/components/MatchCard/LeadMatchCard';
import { ObjectMatchCard } from '@/components/MatchCard/ObjectMatchCard';
import { MatchControls } from '@/components/MatchControls/MatchControls';
import { getLeadById, getMatchById, getObjectById, getMatchLogs } from '@/services/entityService';
import { EntityType, Lead, RealEstateObject } from '@/types/entity';
import { Match } from '@/types/matching';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MatchPage.css';
import { matchStore } from '@/stores/matchStore';
import { matchLogStore } from '@/stores/matchLogStore';
import { observer } from 'mobx-react-lite';

enum MatchStatus {
  OK,
  BIDS,
  WAIT_FOR_ANSWER,
  DECLINED,
}

const getMatchStatus = (type: EntityType, match: Match) => {
  if (match?.leadStatus == 'UNDEFINED' && type == 'object') {
    return MatchStatus.WAIT_FOR_ANSWER;
  }

  if (match?.estateStatus == 'UNDEFINED' && type == 'lead') {
    return MatchStatus.WAIT_FOR_ANSWER;
  }

  if (
    (match?.leadStatus == 'COMMISSION' && match.estateStatus == 'ACCEPTED') ||
    (match.leadStatus == 'ACCEPTED' && match.estateStatus == 'COMMISSION')
  ) {
    return MatchStatus.OK;
  }

  if (
    match?.leadStatus == 'DISLIKE' ||
    match.estateStatus == 'DISLIKE' ||
    match.leadStatus == 'DECLINED' ||
    match.estateStatus == 'DECLINED'
  ) {
    return MatchStatus.DECLINED;
  }

  return MatchStatus.BIDS;
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!type || !id) return;

      setLoading(true);

      try {
        const matchResp = await getMatchById(id);

        matchStore.addMatch(matchResp);

        const matchLogs = await getMatchLogs(id);
        matchLogStore.setLogs(id, matchLogs || []);

        if (type === 'lead') {
          const lead = await getLeadById(matchResp!.leadId);
          setSourceEntity(lead);
        } else {
          const object = await getObjectById(matchResp!.estateId);
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

  if (loading || !id || !sourceEntity || !type) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  const match = matchStore.getMatchById(id);

  const matchStatus = getMatchStatus(type, match!);

  const { leadUserComission, objectUserComission } = getActualComissionValues(id, sourceEntity);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        {sourceEntity!.type === 'object' ? (
          <ObjectMatchCard data={sourceEntity as RealEstateObject} displayComission={matchStatus !== MatchStatus.BIDS} />
        ) : (
          <LeadMatchCard data={sourceEntity as Lead} displayComission={matchStatus !== MatchStatus.BIDS} />
        )}

        {matchStatus === MatchStatus.BIDS && (
          <ComissionBids
            yours={sourceEntity.type === 'object' ? leadUserComission! : objectUserComission!}
            theirs={sourceEntity.type === 'lead' ? leadUserComission! : objectUserComission!}
          />
        )}
      </div>

      {matchStatus === MatchStatus.OK && (
        <Button mode="filled" size="l" style={{ marginBottom: 12 }} onClick={() => {}}>
          Перейти в чат с риэлтором
        </Button>
      )}

      {matchStatus === MatchStatus.WAIT_FOR_ANSWER && <div className="wait-for-answer">Ждем ответа от риэлтора</div>}

      {matchStatus === MatchStatus.DECLINED && <div className="declined">Риэлтор отказался от сделки</div>}

      {matchStatus === MatchStatus.BIDS && <MatchControls onLike={() => {}} onComission={() => {}} onDislike={() => {}} />}
    </div>
  );
});
