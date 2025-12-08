import { type FC } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import type { MatchLog } from '@/types/matching';
import styles from './MatchHistory.module.css';

interface MatchHistoryProps {
  matchLogs: MatchLog[];
}

export const MatchHistory: FC<MatchHistoryProps> = ({ matchLogs }) => {
  const formatLogEntry = (log: MatchLog): string => {
    const userTypeText = log.userType === 'LEAD' ? 'Лид' : 'Риэлтор';
    const statusText = getStatusText(log.status);
    const commissionText = `${log.leadCommission}/${100 - log.leadCommission}`;
    
    return `${userTypeText}. ${statusText}. ${commissionText}`;
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'LIKED':
        return 'Лайкнул';
      case 'DISLIKED':
        return 'Дизлайкнул';
      case 'COMMISSION':
        return 'Предложил комиссию';
      case 'ACCEPTED':
        return 'Принял предложение';
      case 'DECLINED':
        return 'Отклонил предложение';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (matchLogs.length === 0) {
    return null;
  }

  return (
    <div className={styles.matchHistory}>
      <h3 className={styles.title}>История взаимодействия:</h3>

      <div className={styles.logsList}>
        {matchLogs.map((log) => (
          <div key={log.id}>
            <div className={styles.logContent}>
              <MessageCircle className={styles.dialogIcon} size={14} />
              <span className={styles.logText}>{formatLogEntry(log)}</span>
            </div>

            <div className={styles.logDate}>
              <Calendar className={styles.calendarIcon} size={14} />
              <span>{formatDate(log.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
