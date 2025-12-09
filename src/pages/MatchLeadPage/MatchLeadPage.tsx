import {ObjectMatchCard} from '@/components/MatchCard/ObjectMatchCard';
import {MatchHistory} from '@/components/MatchHistory';
import {MatchControls} from '@/components/MatchControls/MatchControls';
import {RealEstateObject} from '@/types/entity';
import {Match, MatchStatus, ObjectMatch} from '@/types/matching';
import {Spinner} from '@telegram-apps/telegram-ui';
import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import classNames from 'classnames';
import {CheckCircle, Clock, XCircle} from 'lucide-react';
import styles from './MatchLeadPage.module.css';
import {matchLogStore} from '@/stores/matchLogStore';
import {observer} from 'mobx-react-lite';
import {ComissionModal} from '@/components/Comission/ComissionModal';
import {getMatchById, getMatchLogs, updateMatch} from '@/requests/matches';
import {objectMatchesStore} from '@/stores/matchesByEntitiesStore';
import {getEstateById} from '@/requests/entities';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getMatchStatusKey, STATUS, StatusKey} from "@/components/Matches/Matches.tsx";


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
        leadCommission: match.leadCommission
    };
};

export const MatchLeadPage: FC = observer(() => {
    const {id} = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const {data: matchData, isLoading: matchLoading} = useQuery({
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

    const {data: objectData, isLoading: objectLoading} = useQuery({
        queryKey: ['object', matchData?.estateId],
        queryFn: () => getEstateById(matchData!.estateId),
        enabled: !!matchData?.estateId,
    });

    const updateMatchMutation = useMutation({
        mutationFn: (params: { status: MatchStatus; commission: number }) =>
            updateMatch({
                id: id!,
                status: params.status,
                leadCommission: params.commission,
            }),
        onSuccess: async (match) => {
            if (objectData) {
                objectMatchesStore.putMatch(objectData.id, match as ObjectMatch);
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
            objectMatchesStore.putMatch(matchData?.leadId, matchData as ObjectMatch);
        }
    }, [matchData]);


    useEffect(() => {
        if (matchData) {
            setShowControls(matchData.commonStatus === 'WAIT_LEAD');
        }
    }, [matchData]);

    const loading = matchLoading || objectLoading || matchLogsLoading;

    if (loading || !id) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner size="l"/>
            </div>
        );
    }

    if (!objectData) {
        return (
            <div className={styles.notFoundContainer}>
                <p>Сущность объекта не найдена</p>
            </div>
        );
    }

    const match = matchData as ObjectMatch;

    if (!match) {
        return (
            <div className={styles.notFoundContainer}>
                <p>Сущность мэтча не найдена</p>
            </div>
        );
    }

    const matchStatus = getMatchStatusKey(match, 'lead');
    const otherStatus = match.leadStatus;
    const {leadCommission} = getActualCommissionValues(match);

    const updateMatchAction = async (status: MatchStatus, commission: number) => {
        updateMatchMutation.mutate({status, commission});
    };

    const statusMessage = getStatusMessage(matchStatus);

    console.log({matchData});

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <ObjectMatchCard
                        data={objectData as RealEstateObject}
                    />

                    <MatchHistory matchLogs={matchLogs || []}/>

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
                                leadCommission || match.leadCommission
                            )
                        }}
                        onComission={() => setIsCommissionModalOpen(true)}
                        onDislike={() => {
                            updateMatchAction(
                                otherStatus === 'COMMISSION' ? 'DECLINED' : 'DISLIKED',
                                leadCommission || match.leadCommission
                            )
                        }}
                    />
                )}
            </div>

            <ComissionModal
                onOpenChange={open => setIsCommissionModalOpen(open)}
                open={isCommissionModalOpen}
                onComissionSubmit={async comission => {
                    updateMatchAction('COMMISSION', comission)
                }}
            />
        </>
    );
});