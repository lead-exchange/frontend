import { type FC, useState } from 'react';
import { Calendar, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { MatchLog } from '@/types/matching';
import styles from './MatchHistory.module.css';

interface MatchHistoryProps {
    matchLogs: MatchLog[];
    initialExpanded?: boolean; // опциональный проп для начального состояния
    maxVisibleItems?: number; // сколько элементов показывать в свернутом состоянии
}

export const MatchHistory: FC<MatchHistoryProps> = ({
                                                        matchLogs,
                                                        initialExpanded = false,
                                                        maxVisibleItems = 1
                                                    }) => {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    // Форматирование записи лога
    const formatLogEntry = (log: MatchLog): [string, string, string] => {
        const userTypeText = log.userType === 'LEAD' ? 'Лид.' : 'Объект.';
        const statusText = getStatusText(log.status);
        const commissionText = `${log.leadCommission}/${100 - log.leadCommission}`;

        return [userTypeText, statusText, commissionText];
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'LIKED':
                return 'Лайкнул.';
            case 'DISLIKED':
                return 'Дизлайкнул.';
            case 'COMMISSION':
                return 'Предложил комиссию.';
            case 'ACCEPTED':
                return 'Принял предложение.';
            case 'DECLINED':
                return 'Отклонил предложение.';
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
            minute: '2-digit'
        });
    };

    // Вычисляем, нужно ли показывать кнопку разворачивания
    const shouldShowToggle = matchLogs.length > maxVisibleItems;

    // Определяем какие логи показывать
    const visibleLogs = isExpanded
        ? matchLogs
        : matchLogs.slice(0, maxVisibleItems);

    if (matchLogs.length === 0) {
        return null;
    }

    return (
        <div className={styles.matchHistory}>
            <div className={styles.header}>
                <h3 className={styles.title}>История взаимодействия</h3>
                {shouldShowToggle && (
                    <button
                        className={styles.toggleButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Свернуть историю' : 'Развернуть историю'}
                    >
                        {isExpanded ? (
                            <>
                                <span>Свернуть</span>
                                <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                <span>Показать все ({matchLogs.length})</span>
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className={`${styles.logsList} ${isExpanded ? styles.expanded : ''}`}>
                {visibleLogs.map((log) => (
                    <div key={log.id} className={styles.logItem}>
                        <div className={styles.logContent}>
                            <MessageCircle
                                className={styles.dialogIcon}
                                size={14}
                            />
                            <span className={styles.logText}>
                                {formatLogEntry(log).map((part, idx) => (
                                    <span key={idx}>
                                        {part}
                                    </span>
                                ))}
                            </span>
                        </div>

                        <div className={styles.logDate}>
                            <Calendar
                                className={styles.calendarIcon}
                                size={14}
                            />
                            <span>{formatDate(log.createdAt)}</span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};