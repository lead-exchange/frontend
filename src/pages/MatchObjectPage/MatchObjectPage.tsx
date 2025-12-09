import {LeadMatchCard} from '@/components/MatchCard/LeadMatchCard';
import {MatchHistory} from '@/components/MatchHistory';
import {MatchControls} from '@/components/MatchControls/MatchControls';
import {Lead} from '@/types/entity';
import {LeadMatch, Match, MatchStatus} from '@/types/matching';
import {Spinner} from '@telegram-apps/telegram-ui';
import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import classNames from 'classnames';
import {CheckCircle, Clock, XCircle} from 'lucide-react';
import styles from './MatchObjectPage.module.css';
import {matchLogStore} from '@/stores/matchLogStore';
import {ComissionModal} from '@/components/Comission/ComissionModal';
import {getMatchById, getMatchLogs, updateMatch} from '@/requests/matches';
import {leadMatchesStore} from '@/stores/matchesByEntitiesStore';
import {getLeadById} from '@/requests/entities';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getMatchStatusKey, STATUS, StatusKey} from "@/components/Matches/Matches.tsx";

// Константы
const COMMISSION_TOTAL = 100;

const getStatusClassName = (status: StatusKey | null) => ({
    [styles.matchAccepted]: status === STATUS.MATCH,
    [styles.needAnswer]: status === STATUS.NEED_ANSWER,
    [styles.waitForAnswer]: status === STATUS.WAITING,
    [styles.declined]: status === STATUS.DECLINED,
});

const getStatusMessage = (status: StatusKey | null) => {
    switch (status) {
        case STATUS.MATCH:
            return {
                icon: <CheckCircle className={styles.statusIcon} size={20}/>,
                text: 'Успешный мэтч! Контакты риэлтора будут отправлены в сообщения Telegram бота.'
            };
        case STATUS.WAITING:
            return {
                icon: <Clock className={styles.statusIcon} size={20}/>,
                text: 'Ждем ответа от риэлтора'
            };
        case STATUS.NEED_ANSWER:
            return {
                icon: <Clock className={styles.statusIcon} size={20}/>,
                text: 'Нужен ваш ответ'
            };
        case STATUS.DECLINED:
            return {
                icon: <XCircle className={styles.statusIcon} size={20}/>,
                text: 'Риэлтор отказался от сделки'
            };
        default:
            return null;
    }
};

const getActualCommissionValues = (
  match: Match
): { leadCommission?: number } => {
    return {
        leadCommission: COMMISSION_TOTAL - match.leadCommission
    };
};

export const MatchObjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatchById(id!),
    enabled: !!id,
  });

    const {
        data: matchLogs,
        isLoading: matchLogsLoading,
        refetch: refetchMatchLogs,
    } = useQuery({
        queryKey: ['matchLogs', id],
        queryFn: () => getMatchLogs(id!),
        enabled: !!id,
    });

  const { data: leadData, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', matchData?.leadId],
    queryFn: () => getLeadById(matchData!.leadId),
    enabled: !!matchData?.leadId,
  });

  const updateMatchMutation = useMutation({
    mutationFn: (params: { status: MatchStatus; commission: number }) =>
      updateMatch({
        id: id!,
        status: params.status,
        leadCommission: params.commission && COMMISSION_TOTAL - params.commission,
      }),
    onSuccess: async (match) => {
      if (leadData) {
        leadMatchesStore.putMatch(leadData.id, match as LeadMatch);
      }
        queryClient.setQueryData(['match', id], match);
        queryClient.invalidateQueries({queryKey: ['matchLogs', id]});
        await refetchMatchLogs();
        setShowControls(false);
    },
  });

  useEffect(() => {
    if (matchLogs && id) {
      matchLogStore.setLogs(id, matchLogs);
    }
  }, [matchLogs, id]);

  useEffect(() => {
    if (matchData) {
      leadMatchesStore.putMatch(matchData.leadId, matchData as LeadMatch);
    }
  }, [matchData]);

  const loading = matchLoading || leadLoading || matchLogsLoading;
    useEffect(() => {
        if (matchData) {
            setShowControls(matchData.commonStatus === 'WAIT_ESTATE');
        }
    }, [matchData]);

  if (loading || !id) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Заявка не найдена</p>
      </div>
    );
  }

  const match = matchData as LeadMatch;

  if (!match) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Мэтч не найден</p>
      </div>
    );
  }

  const matchStatus = getMatchStatusKey(match, 'object');
  const otherStatus = match.estateStatus;
  const { leadCommission } = getActualCommissionValues(match);

  const updateMatchAction = (status: MatchStatus, commission: number) => {
    updateMatchMutation.mutate({ status, commission });
  };

  const statusMessage = getStatusMessage(matchStatus);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <LeadMatchCard
            data={leadData as Lead}
          />

          <MatchHistory matchLogs={matchLogs || []} />

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
                leadCommission || leadData.commissionShare
              );
            }}
            onComission={() => setIsCommissionModalOpen(true)}
            onDislike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'DECLINED' : 'DISLIKED',
                leadCommission || leadData.commissionShare
              );
            }}
          />
        )}
      </div>

      <ComissionModal
        onOpenChange={open => setIsCommissionModalOpen(open)}
        open={isCommissionModalOpen}
        onComissionSubmit={async commission => {
          updateMatchAction('COMMISSION', commission);
        }}
      />
    </>
  );
};
