import { type FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from '@telegram-apps/telegram-ui';
import { TinderSwiper } from '@/components/TinderSwiper/TinderSwiper';
import type { EntityType, Lead, RealEstateObject } from '@/types/entity';
import { createMatch } from '@/requests/matches';
import { userStore } from '@/stores/userStore';
import { leadMatchesStore, objectMatchesStore } from '@/stores/matchesByEntitiesStore';
import { LeadMatch, MatchStatus, ObjectMatch } from '@/types/matching';
import { leadStore } from '@/stores/leadStore';
import { realEstateStore } from '@/stores/realEstateStore';
import { getLeadsForObject, getObjectsForLead } from '@/requests/tinder';
import { observer } from 'mobx-react-lite';

export const TinderPage: FC = observer(() => {
  const { type, id } = useParams<{ type: EntityType; id: string }>();

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
          const lead = await leadStore.getLeadById(id);
          if (!lead) {
            return;
          }

          setSourceEntity(lead);
          if (lead) {
            const objects = await getObjectsForLead(id);
            setMatchItems(objects);
          }
        } else {
          const object = await realEstateStore.getObjectById(id);
          if (!object) {
            return;
          }

          setSourceEntity(object);
          if (object) {
            const leads = await getLeadsForObject(id);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
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

  const addMatch = async (item: Lead | RealEstateObject, status: MatchStatus, commission: number) => {
    const match = await createMatch({
      leadId: item.type === 'lead' ? item.id : sourceEntity.id,
      estateId: item.type === 'object' ? item.id : sourceEntity.id,
      status: status,
      leadCommission: sourceEntity.type === 'lead' ? commission : commission && 100 - commission,
      updatedBy: userStore.user!.id,
    });

    if (sourceEntity.type === 'lead') {
      leadMatchesStore.putMatch(sourceEntity.id, match as LeadMatch);
    } else {
      objectMatchesStore.putMatch(sourceEntity.id, match as ObjectMatch);
    }
  };

  const handleLike = async (item: Lead | RealEstateObject) => {
    await addMatch(item, 'LIKED', item.commissionShare);

    setLikedItems(prev => [...prev, item]);
  };

  const handleDislike = async (item: Lead | RealEstateObject) => {
    await addMatch(item, 'DISLIKED', item.commissionShare);

    setDislikedItems(prev => [...prev, item]);
  };

  const handleCustomShare = async (item: Lead | RealEstateObject, comission: number) => {
    await addMatch(item, 'COMMISSION', comission);

    setCustomShareItems(prev => [...prev, item]);
  };

  const handleFinish = () => {
    navigate('/results', {
      state: {
        entityName: sourceEntity.type === 'lead' ? sourceEntity.name : sourceEntity.displayName,
        entityType: sourceEntity.type,
        total: matchItems.length,
        liked: likedItems,
        disliked: dislikedItems,
        customShare: customShareItems,
      },
    });
  };

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
});
