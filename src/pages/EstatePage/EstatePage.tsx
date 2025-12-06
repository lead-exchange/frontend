import { getEstateById } from '@/requests/entities';
import { RealEstateObject } from '@/types/entity';
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Image } from '@telegram-apps/telegram-ui';
import '../../index.css';
import styles from './styles.module.css';
import { Matches } from '@/components/Matches/Matches';
import { getObjectMatches } from '@/requests/matches';
import { objectMatchesStore } from '@/stores/matchesByEntitiesStore';

const propertyTypeLabels: Record<string, string> = {
  flat: 'Квартира',
  room: 'Комната',
  commerce: 'Коммерция',
  house: 'Загородка',
  land: 'Участок',
  garage: 'Машиноместо/гараж',
};

const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ru-RU')}`;
};

const formatAddress = (address: RealEstateObject['attributes']['address']): string => {
  const parts = [
    address.streetName && (address.streetType ? address.streetType + ' ' : '') + address.streetName,
    address.house ? 'д. ' + address.house : '',
  ].filter(Boolean);

  return parts.join(', ');
};

const formatRegion = (address: RealEstateObject['attributes']['address']): string => {
  if (address.cityName) {
    return address.cityName;
  } else {
    return address.regionName + (address.regionType ? ' ' + address.regionType : '')
  }
};

export const EstatePage: FC = () => {
  const { estateId } = useParams<{ estateId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estate, setEstate] = useState<RealEstateObject | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!estateId) return;

      setLoading(true);

      try {
        const estateData = await getEstateById(estateId);
        setEstate(estateData);

        const matches = await getObjectMatches(estateId);
        objectMatchesStore.setMatches(estateId, matches);
      } catch (error) {
        console.error('Failed to load estate:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [estateId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  if (!estate) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Объект не найден</p>
      </div>
    );
  }

  const matches = objectMatchesStore.getMatchesByEntity(estateId!);

  const priceText = formatPrice(estate.attributes.price);
  const bedroomsText = estate.attributes.rooms ? `${estate.attributes.rooms}-комн.` : null;
  const addressText = formatAddress(estate.attributes.address);
  const regionText = formatRegion(estate.attributes.address);

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: 'var(--tgui--bg_color)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Название объекта */}
      <div className={styles.topInfo}>
        <Image
          src={
            estate.attributes.photos?.[0] ||
            new URL('/assets/estate/elizarovskaya/elizarovskaya-1.jpg', import.meta.url).href
          }
          size={96}
        />

        <div className={styles.topInfoText}>
          <div>{regionText}</div>
          <div>{addressText}</div>
          <div>{bedroomsText} {propertyTypeLabels[estate.attributes.realtyType].toLowerCase()}</div>
          <div>{priceText} руб.</div>
          <div>{estate.attributes.areaCommon} кв. м.</div>
        </div>
      </div>

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
          <span className="comission-bids__value">Агент продавца: {estate.commissionShare}%</span>
        </div>

        <div
          className="comission-bids comission-bids__theirs"
          style={{
            padding: '0px 2px 0px 2px',
          }}
        >
          <span className="comission-bids__value">Агент покупателя: {100 - estate.commissionShare}%</span>
        </div>
      </div>

      {/* Описание */}
      {estate.attributes.description && (
        <div
          style={{
            color: 'var(--tgui--text_color)',
            fontSize: '15px',
            lineHeight: '20px',
            marginBottom: '24px',
          }}
        >
          {estate.attributes.description}
        </div>
      )}

      {/* Кнопка рекомендаций */}
      <Button mode="filled" size="l" stretched onClick={() => navigate(`/tinder/object/${estate.id}`)}>
        Смотреть рекомендации
      </Button>

      {matches.length > 0 && <Matches type="object" matches={matches} />}
    </div>
  );
};