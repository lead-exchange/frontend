import { getLeadById, deleteLead } from '@/requests/entities';
import { Lead } from '@/types/entity';
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Chip, Button } from '@telegram-apps/telegram-ui';
import { Archive, Pencil, Trash } from 'lucide-react';
import '../../index.css';
import styles from './styles.module.css';
import { Matches } from '@/components/Matches/Matches';
import { getLeadMatches } from '@/requests/matches';
import { leadMatchesStore } from '@/stores/matchesByEntitiesStore';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Лид не найден</p>
      </div>
    );
  }

  const matches = leadMatchesStore.getMatchesByEntity(leadId!);

  const priceRange = `< ${formatPrice(lead.requirements.maxPrice)}`;
  const bedroomsText = lead.requirements.bedrooms ? `${lead.requirements.bedrooms}-комн.` : null;

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

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: 'var(--tgui--bg_color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      {/* Имя клиента */}
      <div className={`${styles.header} title-3`}>{lead.name}</div>

      {/* Chips с основной информацией */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Chip mode="mono">{propertyTypeLabels[lead.requirements.propertyType]}</Chip>
        {bedroomsText && <Chip mode="mono">{bedroomsText}</Chip>}
        <Chip mode="mono">{priceRange}</Chip>
        {lead.requirements.locations.map((location, index) => (
          <Chip key={index} mode="mono">
            {location}
          </Chip>
        ))}
      </div>

      {/* Локации */}

      <div
        className="comission-bids-container"
        style={{
          padding: '8px',
          alignSelf: 'start',
        }}
      >
        <div
          className="comission-bids comission-bids__yours"
          style={{
            padding: '0px 2px 0px 2px',
          }}
        >
          <span className="comission-bids__value">Агент покупателя: {lead.commissionShare}%</span>
        </div>

        <div
          className="comission-bids comission-bids__theirs"
          style={{
            padding: '0px 2px 0px 2px',
          }}
        >
          <span className="comission-bids__value">Агент продавца: {100 - lead.commissionShare}%</span>
        </div>
      </div>

      {/* Описание */}
      {lead.description && (
        <div
          style={{
            color: 'var(--tgui--text_color)',
            fontSize: '15px',
            lineHeight: '20px',
          }}
        >
          {lead.description}
        </div>
      )}

      {/* Кнопки действий */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <Button mode="bezeled" size="m" before={<Pencil />} onClick={() => navigate(`/user/lead/${leadId}/edit`)}>
          Редакт.
        </Button>
        <Button mode="bezeled" size="m" before={<Archive />}>
          Приост.
        </Button>
        <Button mode="bezeled" size="m" before={<Trash />} onClick={handleDelete}>
          Удалить
        </Button>
      </div>

      {/* Кнопка рекомендаций */}
      <Button mode="filled" size="l" stretched onClick={() => navigate(`/tinder/lead/${lead.id}`)}>
        Смотреть рекомендации
      </Button>

      {matches.length > 0 && <Matches type="lead" matches={matches} />}
    </div>
  );
};
