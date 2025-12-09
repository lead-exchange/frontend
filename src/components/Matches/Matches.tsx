import { ObjectMatch, LeadMatch } from '@/types/matching';
import { Cell, Image, Section, Spinner } from '@telegram-apps/telegram-ui';
import { ChevronRight, User } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import styles from './Matches.module.css';
import { EntityType } from '@/types/entity';
import { matchLogStore } from '@/stores/matchLogStore';
import { useNavigate } from 'react-router-dom';
import { getMatchLogs } from '@/requests/matches';
import { AppRoutes } from '@/navigation/routePaths';

const COMMON_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  WAIT_LEAD: 'WAIT_LEAD',
  WAIT_ESTATE: 'WAIT_ESTATE',
}

export const STATUS = {
  MATCH: 'MATCH',
  NEED_ANSWER: 'NEED_ANSWER',
  WAITING: 'WAITING',
  DECLINED: 'DECLINED',
};
export type StatusKey = (typeof STATUS)[keyof typeof STATUS];

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

export const getMatchStatusKey = (match: ObjectMatch | LeadMatch, type: EntityType): StatusKey | null => {
  if (match.commonStatus === COMMON_STATUS.SUCCESS) {
    return STATUS.MATCH;
  }
  if (match.commonStatus === COMMON_STATUS.FAILED) {
    return STATUS.DECLINED;
  }
  if (type === 'lead') {
    if (match.commonStatus === COMMON_STATUS.WAIT_ESTATE) {
      return STATUS.WAITING;
    }
    if (match.commonStatus === COMMON_STATUS.WAIT_LEAD) {
      return STATUS.NEED_ANSWER;
    }
  }
  if (type === 'object') {
    if (match.commonStatus === COMMON_STATUS.WAIT_ESTATE) {
      return STATUS.NEED_ANSWER;
    }
    if (match.commonStatus === COMMON_STATUS.WAIT_LEAD) {
      return STATUS.WAITING;
    }
  }
  return null;
};

export const getMatchStatusText = (status: StatusKey | null): string => {
  return status ? statusTextByKey[status] : '';
};

export const Matches: FC<MatchesProps> = ({ type, matches }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  const handleLeadMatchClick = (id: number | string) => {
    navigate(AppRoutes.matches.lead(id));
  };

  const handleObjectMatchClick = (id: number | string) => {
    navigate(AppRoutes.matches.object(id));
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
