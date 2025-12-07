import { ObjectMatch, LeadMatch } from '@/types/matching';
import { Cell, Image, Section, Spinner } from '@telegram-apps/telegram-ui';
import { ChevronRight, User } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import styles from './Matches.module.css';
import { EntityType } from '@/types/entity';
import { matchLogStore } from '@/stores/matchLogStore';
import { useNavigate } from 'react-router-dom';
import { getMatchLogs } from '@/requests/matches';
import { AppRoutes, MATCH_TYPES } from '@/navigation/routePaths';

const STATUS = {
  MATCH: 'MATCH',
  NEED_ANSWER: 'NEED_ANSWER',
  WAITING: 'WAITING',
  DECLINED: 'DECLINED',
} as const;

type StatusKey = (typeof STATUS)[keyof typeof STATUS];

const statusToClass: Record<StatusKey, string> = {
  [STATUS.MATCH]: styles.statusMatch,
  [STATUS.NEED_ANSWER]: styles.statusNeedAnswer,
  [STATUS.WAITING]: styles.statusNeedAnswer,
  [STATUS.DECLINED]: styles.statusDeclined,
};

const statusTextByKey: Record<StatusKey, string> = {
  [STATUS.MATCH]: 'Мэтч',
  [STATUS.NEED_ANSWER]: 'Нужен ваш ответ',
  [STATUS.WAITING]: 'Ждём ответа',
  [STATUS.DECLINED]: 'Отказался',
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

const getStatusStyle = (status: StatusKey | null): string => {
  return status ? statusToClass[status] : '';
};

const getMatchStatusKey = (match: ObjectMatch | LeadMatch, type: EntityType): StatusKey | null => {
  const matchLogs = matchLogStore.getLogsByMatch(match.id);

  if (!matchLogs) {
    return null;
  }

  const logs = matchLogs.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const lastLeadStatus = logs.filter(log => log.userType == 'lead').at(0)?.status || match.leadStatus || 'UNDEFINED';
  const lastObjectStatus = logs.filter(log => log.userType == 'object').at(0)?.status || match.estateStatus || 'UNDEFINED';

  if (lastObjectStatus === 'LIKED' && lastLeadStatus === 'LIKED') {
    return STATUS.MATCH;
  }

  if (lastObjectStatus === 'ACCEPTED' || lastLeadStatus === 'ACCEPTED') {
    return STATUS.MATCH;
  }

  if (type === 'lead') {
    switch (true) {
      case lastLeadStatus === 'UNDEFINED' || lastObjectStatus === 'COMMISSION':
        return STATUS.NEED_ANSWER;
      case lastObjectStatus === 'UNDEFINED':
        return STATUS.WAITING;
      case lastObjectStatus === 'DECLINED' || lastObjectStatus === 'DISLIKED':
        return STATUS.DECLINED;
    }
  }

  if (type === 'object') {
    switch (true) {
      case lastObjectStatus === 'UNDEFINED' || lastLeadStatus === 'COMMISSION':
        return STATUS.NEED_ANSWER;
      case lastLeadStatus === 'UNDEFINED':
        return STATUS.WAITING;
      case lastLeadStatus === 'DECLINED' || lastLeadStatus === 'DISLIKED':
        return STATUS.DECLINED;
    }
  }

  return null;
};

const getMatchStatusText = (status: StatusKey | null): string => {
  return status ? statusTextByKey[status] : '';
};

export const Matches: FC<MatchesProps> = ({ type, matches }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  const handleLeadMatchClick = (id: number | string) => {
    navigate(AppRoutes.matches(MATCH_TYPES.LEAD, id));
  };

  const handleObjectMatchClick = (id: number | string) => {
    navigate(AppRoutes.matches(MATCH_TYPES.OBJECT, id));
  };

  useEffect(() => {
    const promises = [];

    for (const match of matches) {
      promises.push(getMatchLogs(match.id).then(matchLogs => matchLogStore.setLogs(match.id, matchLogs)));
    }

    Promise.all(promises).then(() => setLoading(false));
  }, matches);

  if (loading) {
    return (
      <div className={styles.matchesSpinner}>
        <Spinner size="m" />
      </div>
    );
  }

  return (
    <div className={styles.matchesContainer}>
      <Section.Header className={styles.matchesHeader} large>
        Найденные мэтчи
      </Section.Header>

      {matches.map(match => {
        const statusKey = getMatchStatusKey(match, type);
        const statusText = getMatchStatusText(statusKey);
        const statusClass = getStatusStyle(statusKey);

        return type === 'lead' ? (
          <Cell
            key={match.id}
            onClick={() => handleLeadMatchClick(match.id)}
            className={styles.entityMatch}
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
              <span className={`${styles.matchStatus} ${statusClass}`}>
                {statusText}
                <ChevronRight size={16} />
              </span>
            }
          >
            <span className={styles.matchName}>{(match as LeadMatch).estateTitle || 'Название'}</span>
          </Cell>
        ) : (
          <Cell
            key={match.id}
            onClick={() => handleObjectMatchClick(match.id)}
            before={<User size={24} />}
            after={
              <span className={`${styles.matchStatus} ${statusClass}`}>
                {statusText}
                <ChevronRight />
              </span>
            }
          >
            <span className={styles.matchName}>{(match as ObjectMatch).leadName}</span>
          </Cell>
        );
      })}
    </div>
  );
}
;
