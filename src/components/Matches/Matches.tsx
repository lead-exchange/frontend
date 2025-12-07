import { ObjectMatch, LeadMatch } from '@/types/matching';
import { Cell, Image, Section, Spinner } from '@telegram-apps/telegram-ui';
import { ChevronRight, User } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import './Matches.css';
import { EntityType } from '@/types/entity';
import { matchLogStore } from '@/stores/matchLogStore';
import { useNavigate } from 'react-router-dom';
import { getMatchLogs } from '@/requests/matches';

const statusToClass: Record<string, string> = {
  'Мэтч': 'status_match',
  'Нужен ваш ответ': 'status_need_answer',
  'Ждём ответа': 'status_need_answer',
  'Отказался': 'status_declined',
};

type MatchesProps = LeadMatchesProps | ObjectMatchesProps;

interface LeadMatchesProps {
  type: 'lead';
  matches: LeadMatch[];
}

interface ObjectMatchesProps {
  type: 'object';
  matches: ObjectMatch[];
}

const getStatusStyle = (val: string): string => {
  return statusToClass[val];
}

const getMatchStatusText = (match: ObjectMatch | LeadMatch, type: EntityType): string => {
  const matchLogs = matchLogStore.getLogsByMatch(match.id);

  const result = '';

  if (!matchLogs) {
    return result;
  }

  const logs = matchLogs.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const lastLeadStatus = logs.filter(log => log.userType == 'lead').at(0)?.status || match.leadStatus || 'UNDEFINED';
  const lastObjectStatus = logs.filter(log => log.userType == 'object').at(0)?.status || match.estateStatus || 'UNDEFINED';

  if (lastObjectStatus === 'LIKED' && lastLeadStatus === 'LIKED') {
    return 'Мэтч';
  }
  if (lastObjectStatus === 'ACCEPTED' || lastLeadStatus === 'ACCEPTED') {
    return 'Мэтч';
  }

  if (type === 'lead') {
    if (lastObjectStatus === 'DECLINED' || lastObjectStatus === 'DISLIKED') {
      return 'Отказался';
    }
    if (lastLeadStatus === 'UNDEFINED' || lastObjectStatus === 'COMMISSION') {
      return 'Нужен ваш ответ';
    }
    if (lastObjectStatus === 'UNDEFINED') {
      return 'Ждём ответа';
    }
  }

  if (type === 'object') {
    if (lastLeadStatus === 'DECLINED' || lastLeadStatus === 'DISLIKED') {
      return 'Отказался';
    }
    if (lastObjectStatus === 'UNDEFINED' || lastLeadStatus === 'COMMISSION') {
      return 'Нужен ваш ответ';
    }
    if (lastLeadStatus === 'UNDEFINED') {
      return 'Ждём ответа';
    }
  }

  return '';
};

export const Matches: FC<MatchesProps> = ({ type, matches }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const promises = [];

    for (const match of matches) {
      promises.push(getMatchLogs(match.id).then(matchLogs => matchLogStore.setLogs(match.id, matchLogs)));
    }

    Promise.all(promises).then(() => setLoading(false));
  }, matches);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Spinner size="m" />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <Section.Header className="matches-header" large>
        Найденные мэтчи
      </Section.Header>

      {matches.map(match =>
        type === 'lead' ? (
          <Cell
            onClick={() => navigate(`/matches/lead/${match.id}`)}
            className="entity-match"
            before={
              <Image
                src={
                  (match as LeadMatch).estatePhoto ||
                  new URL('/assets/estate/elizarovskaya/elizarovskaya-1.jpg', import.meta.url).href
                }
                size={40}
              />
            }
            after={
              <span className={`match__status ${getStatusStyle(getMatchStatusText(match, type))}`}>
                {getMatchStatusText(match, type)}
                <ChevronRight size={16} />
              </span>
            }
            key={match.id}
          >
            <span className="match__name">{(match as LeadMatch).estateTitle || 'Название'}</span>
          </Cell>
        ) : (
          <Cell
            onClick={() => navigate(`/matches/object/${match.id}`)}
            before={<User size={24}></User>}
            after={
              <span className={`match__status ${getStatusStyle(getMatchStatusText(match, type))}`}>
                {getMatchStatusText(match, type)}
                <ChevronRight />
              </span>
            }
            key={match.id}
          >
            <span className="match__name">{(match as ObjectMatch).leadName}</span>
          </Cell>
        )
      )}
    </div>
  );
};
