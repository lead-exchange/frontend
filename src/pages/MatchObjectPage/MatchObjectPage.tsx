import { ComissionBids } from '@/components/Comission/ComissionBids';
import { LeadMatchCard } from '@/components/MatchCard/LeadMatchCard';
import { MatchHistory } from '@/components/MatchHistory';
import { MatchControls } from '@/components/MatchControls/MatchControls';
import { Lead } from '@/types/entity';
import { Match, MatchStatus, LeadMatch } from '@/types/matching';
import { Spinner } from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import styles from './MatchObjectPage.module.css';
import { matchLogStore } from '@/stores/matchLogStore';
import { ComissionModal } from '@/components/Comission/ComissionModal';
import { updateMatch, getMatchById, getMatchLogs } from '@/requests/matches';
import { leadMatchesStore } from '@/stores/matchesByEntitiesStore';
import { getLeadById } from '@/requests/entities';
import { useQuery, useMutation } from '@tanstack/react-query';

// Константы
const COMMISSION_TOTAL = 100;

// Хелперы
const getCommissionValues = (leadCommission: number, userCommission?: number) => {
  const yours = userCommission ?? leadCommission;
  const theirs = leadCommission != null ? COMMISSION_TOTAL - leadCommission : 0;
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
        text: 'Ждем ответа от покупателя'
      };
    case MatchStatusEnum.DECLINED:
      return {
        icon: <XCircle className={styles.statusIcon} size={20} />,
        text: 'Покупатель отказался от сделки'
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
  if (match?.estateStatus === 'UNDEFINED') {
    return MatchStatusEnum.WAIT_FOR_ANSWER;
  }

  if (
    (match?.leadStatus === 'COMMISSION' && match.estateStatus === 'ACCEPTED') ||
    (match.leadStatus === 'ACCEPTED' && match.estateStatus === 'COMMISSION')
  ) {
    return MatchStatusEnum.OK;
  }

  if (
    match?.leadStatus === 'DISLIKED' ||
    match.estateStatus === 'DISLIKED' ||
    match.leadStatus === 'DECLINED' ||
    match.estateStatus === 'DECLINED'
  ) {
    return MatchStatusEnum.DECLINED;
  }

  return MatchStatusEnum.BIDS;
};

const getActualCommissionValues = (
  matchId: string,
  sourceEntity: Lead
): { leadUserCommission?: number } => {
  const matchLogs = matchLogStore.getLogsByMatch(matchId);

  const result = {
    leadUserCommission: sourceEntity.commissionShare,
  };

  if (!matchLogs) {
    return result;
  }

  const logs = matchLogs.slice().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const lastLead = logs.filter(log => log.userType === 'lead').at(0);

  if (lastLead) {
    result.leadUserCommission = lastLead.leadCommission;
  }

  return result;
};

export const MatchObjectPage: FC = () => {
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
    onSuccess: (match) => {
      if (leadData) {
        leadMatchesStore.putMatch(leadData.id, match as LeadMatch);
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
      leadMatchesStore.putMatch(matchData.leadId, matchData as LeadMatch);
    }
  }, [matchData]);

  const loading = matchLoading || leadLoading || matchLogsLoading;

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

  const matchStatus = getMatchStatus(match);
  const otherStatus = match.estateStatus;
  const { leadUserCommission } = getActualCommissionValues(id, leadData);

  const updateMatchAction = (status: MatchStatus, commission: number) => {
    updateMatchMutation.mutate({ status, commission });
  };

  const statusMessage = getStatusMessage(matchStatus);
  const commissionValues = getCommissionValues(leadData.commissionShare, leadUserCommission);
  const showControls = match.commonStatus === 'WAIT_ESTATE' || match.commonStatus === 'WAIT_LEAD';
  const showCommissionBids = matchStatus === MatchStatusEnum.BIDS;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <LeadMatchCard
            data={leadData as Lead}
            displayComission={matchStatus !== MatchStatusEnum.BIDS}
          />

          <MatchHistory matchLogs={matchLogs || []} />

          {showCommissionBids && (
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
                leadUserCommission || leadData.commissionShare
              );
            }}
            onComission={() => setIsCommissionModalOpen(true)}
            onDislike={() => {
              updateMatchAction(
                otherStatus === 'COMMISSION' ? 'DECLINED' : 'DISLIKED',
                leadUserCommission || leadData.commissionShare
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
