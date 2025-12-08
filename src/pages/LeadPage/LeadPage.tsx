import { getLeadById, deleteLead, archiveLead, unarchiveLead } from '@/requests/entities';
import { Lead } from '@/types/entity';
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Chip, Button } from '@telegram-apps/telegram-ui';
import { Archive, ArchiveRestore, Pencil, Trash } from 'lucide-react';
import '../../index.css';
import styles from './LeadPage.module.css';
import { Matches } from '@/components/Matches/Matches';
import { getLeadMatches } from '@/requests/matches';
import { leadMatchesStore } from '@/stores/matchesByEntitiesStore';
import { AppRoutes } from '@/navigation/routePaths';

const propertyTypeLabels: Record<string, string> = {
  flat: 'Квартира',
  room: 'Комната',
  commerce: 'Коммерция',
  house: 'Загородка',
  land: 'Участок',
  garage: 'Машиноместо/гараж',
};

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} млн.`;
  }
  return `${price.toLocaleString('ru-RU')} ₽`;
};

export const LeadPage: FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!leadId) return;

      setLoading(true);

      try {
        const leadData = await getLeadById(leadId);
        setLead(leadData);

        const matches = await getLeadMatches(leadId);
        leadMatchesStore.setMatches(leadId, matches);
      } catch (error) {
        console.error('Failed to load lead:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [leadId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Лид не найден</p>
      </div>
    );
  }

  const matches = leadMatchesStore.getMatchesByEntity(leadId!);

  const statusOrder = ['SUCCESS', 'WAIT_LEAD', 'WAIT_ESTATE', 'FAILED'];
  const sortedMatches = [...matches].sort((a, b) => {
    const indexA = statusOrder.indexOf(a.commonStatus);
    const indexB = statusOrder.indexOf(b.commonStatus);

    const orderA = indexA === -1 ? statusOrder.length : indexA;
    const orderB = indexB === -1 ? statusOrder.length : indexB;

    return orderA - orderB;
  });

  const priceRange = `< ${formatPrice(lead.requirements.maxPrice)}`;
  const bedroomsText = lead.requirements.bedrooms ? `${lead.requirements.bedrooms}-комн.` : null;

  const handleArchive = async () => {
    if (!leadId) return;

    try {
      const newLead = await archiveLead(leadId);
      console.log('Lead archived successfully');
      setLead(newLead);
    } catch (error) {
      console.error('Failed to archive lead:', error);
      alert('Ошибка при архивировании лида');
    }
  };

  const handleUnarchive = async () => {
    if (!leadId) return;

    try {
      const newLead = await unarchiveLead(leadId);
      console.log('Lead unarchived successfully');
      setLead(newLead);
    } catch (error) {
      console.error('Failed to unarchive lead:', error);
      alert('Ошибка при разархивировании лида');
    }
  };

  const handleDelete = async () => {
    if (!leadId) return;

    try {
      await deleteLead(leadId);
      console.log('Lead deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete lead:', error);
      alert('Ошибка при удалении лида');
    }
  };

  const handleEditClick = () => {
    if (!leadId) return;
    navigate(AppRoutes.lead.edit(leadId));
  };

  const handleRecommendationsClick = () => {
    navigate(AppRoutes.tinder('lead', lead.id));
  };

  return (
    <div className={styles.container}>
      {/* Имя клиента */}
      <div className={`${styles.header} title-3`}>{lead.name}</div>

      {/* Chips с основной информацией */}
      <div className={styles.chipsContainer}>
        <Chip mode="mono">{propertyTypeLabels[lead.requirements.propertyType]}</Chip>

        {bedroomsText && <Chip mode="mono">{bedroomsText}</Chip>}
        <Chip mode="mono">{priceRange}</Chip>

        {lead.requirements.locations.map((location, index) => (
          <Chip key={`${location}-${index}`} mode="mono">
            {location}
          </Chip>
        ))}
      </div>

      {/* Локации */}

      <div className={`comission-bids-container ${styles.commissionContainer}`}>
        <div
          className={`comission-bids comission-bids__yours ${styles.commissionItem}`}
        >
          <span className="comission-bids__value">Агент покупателя: {lead.commissionShare}%</span>
        </div>

        <div
          className={`comission-bids comission-bids__theirs ${styles.commissionItem}`}
        >
          <span className="comission-bids__value">Агент продавца: {100 - lead.commissionShare}%</span>
        </div>
      </div>

      {/* Описание */}
      {lead.description && (
        <div className={styles.description}>
          {lead.description}
        </div>
      )}

      {/* Кнопки действий */}
      <div className={styles.actionsContainer}>
        <Button
          mode="bezeled"
          size="m"
          className={styles.actionButtonSmall}
          before={<Pencil />}
          onClick={handleEditClick}
        >
          Редакт.
        </Button>
        {lead.status === 'ARCHIVE' ? (
          <Button
            mode="bezeled"
            size="m"
            className={styles.actionButtonSmall}
            before={<ArchiveRestore />}
            onClick={handleUnarchive}
          >
            Возобн.
          </Button>
        ) : (
          <Button
            mode="bezeled"
            size="m"
            className={styles.actionButtonSmall}
            before={<Archive />}
            onClick={handleArchive}
          >
            Приост.
          </Button>
        )}
        <Button
          mode="bezeled"
          size="m"
          className={styles.actionButtonSmall}
          before={<Trash />}
          onClick={handleDelete}
        >
          Удалить
        </Button>
      </div>

      {/* Кнопка рекомендаций */}
      <Button
        mode="filled"
        size="l"
        stretched
        className={styles.recommendationsButton}
        onClick={handleRecommendationsClick}
      >
        Смотреть рекомендации
      </Button>

      {sortedMatches.length > 0 && <Matches type="lead" matches={sortedMatches} />}
    </div>
  );
};