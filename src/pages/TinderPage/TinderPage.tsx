import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from '@telegram-apps/telegram-ui';
import { TinderSwiper } from '@/components/TinderSwiper/TinderSwiper';
import { getLeadById, getObjectsForLead, getObjectById, getLeadsForObject } from '@/services/entityService';
import type { Lead, RealEstateObject } from '@/types/entity';

export const TinderPage: FC = () => {
  const { type, id } = useParams<{ type: 'lead' | 'object'; id: string }>();
  const navigate = useNavigate();
  const [sourceEntity, setSourceEntity] = useState<Lead | RealEstateObject | null>(null);
  const [matchItems, setMatchItems] = useState<(Lead | RealEstateObject)[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<(Lead | RealEstateObject)[]>([]);
  const [dislikedItems, setDislikedItems] = useState<(Lead | RealEstateObject)[]>([]);
  const [customShareItems, setCustomShareItems] = useState<(Lead | RealEstateObject)[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!type || !id) return;

      setLoading(true);
      
      try {
        if (type === 'lead') {
          const lead = await getLeadById(id);
          setSourceEntity(lead);
          if (lead) {
            const objects = await getObjectsForLead();
            setMatchItems(objects);
          }
        } else {
          const object = await getObjectById(id);
          setSourceEntity(object);
          if (object) {
            const leads = await getLeadsForObject();
            setMatchItems(leads);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, id]);

  const handleLike = (item: Lead | RealEstateObject) => {
    setLikedItems(prev => [...prev, item]);
  };

  const handleDislike = (item: Lead | RealEstateObject) => {
    setDislikedItems(prev => [...prev, item]);
  };

  const handleCustomShare = (item: Lead | RealEstateObject) => {
    setCustomShareItems(prev => [...prev, item]);
  };

  const handleFinish = () => {
    navigate('/results', {
      state: {
        sourceEntity,
        total: matchItems.length,
        liked: likedItems,
        disliked: dislikedItems,
        customShare: customShareItems,
      },
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size='l' />
      </div>
    );
  }

  if (!sourceEntity) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Сущность не найдена</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TinderSwiper
        items={matchItems}
        onLike={handleLike}
        onDislike={handleDislike}
        onCustomShare={handleCustomShare}
        onFinish={handleFinish}
      />
    </div>
  );
};
