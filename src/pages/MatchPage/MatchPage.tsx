import { ComissionBids } from '@/components/Comission/ComissionBids';
import { LeadMatchCard } from '@/components/MatchCard/LeadMatchCard';
import { ObjectMatchCard } from '@/components/MatchCard/ObjectMatchCard';
import { MatchControls } from '@/components/MatchControls/MatchControls';
import { getLeadById, getMatchById, getObjectById } from '@/services/entityService';
import { EntityType, Lead, Match, RealEstateObject } from '@/types/entity';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MatchPage.css';

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

export const MatchPage: FC = () => {
  const { type, id } = useParams<{
    type: EntityType;
    id: string;
  }>();

  const [sourceEntity, setSourceEntity] = useState<Lead | RealEstateObject | null>(null);

  const [match, setMatch] = useState<Match | null>(null);

  const [loading, setLoading] = useState(true);

  // May refactor later to use tanstack or some state management lib
  useEffect(() => {
    const loadData = async () => {
      if (!type || !id) return;

      setLoading(true);

      try {
        const matchResp = await getMatchById(id);
        setMatch(matchResp);

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  const matchStatus = getMatchStatus(type!, match!);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        {sourceEntity!.type === 'object' ? (
          <ObjectMatchCard data={sourceEntity as RealEstateObject} displayComission={matchStatus !== MatchStatus.BIDS} />
        ) : (
          <LeadMatchCard data={sourceEntity as Lead} displayComission={matchStatus !== MatchStatus.BIDS} />
        )}

        {matchStatus === MatchStatus.BIDS && <ComissionBids yours={30} theirs={20} />}
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
};
