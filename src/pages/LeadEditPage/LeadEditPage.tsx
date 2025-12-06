import { getLeadById, updateLead } from '@/requests/entities';
import { Lead } from '@/types/entity';
import { Section, Input, Button, List, Select, Spinner } from '@telegram-apps/telegram-ui';
import { type FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const propertyTypeOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'room', label: 'Комната' },
  { value: 'commerce', label: 'Коммерция' },
  { value: 'house', label: 'Загородка' },
  { value: 'land', label: 'Участок' },
  { value: 'garage', label: 'Машиноместо/гараж' },
];

export const LeadEditPage: FC = () => {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionShare, setCommissionShare] = useState('');
  const [propertyType, setPropertyType] = useState<'flat' | 'room' | 'commerce' | 'house' | 'land' | 'garage'>('flat');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [locations, setLocations] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadLead = async () => {
      if (!leadId) return;

      setLoading(true);
      try {
        const lead: Lead = await getLeadById(leadId);

        // Pre-fill form with existing lead data
        setName(lead.name || '');
        setPhone(lead.phone || '');
        setCommissionShare(lead.commissionShare.toString());
        setPropertyType(lead.requirements.propertyType);
        setMinPrice(lead.requirements.minPrice.toString());
        setMaxPrice(lead.requirements.maxPrice.toString());
        setMinArea(lead.requirements.minArea.toString());
        setMaxArea(lead.requirements.maxArea.toString());
        setLocations(lead.requirements.locations.join(', '));
        setBedrooms(lead.requirements.bedrooms?.toString() || '');
        setDescription(lead.description || '');
      } catch (error) {
        console.error('Failed to load lead:', error);
        alert('Ошибка при загрузке лида');
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [leadId]);

  const handleSubmit = async () => {
    if (!leadId) return;

    const leadData = {
      name,
      phone,
      commissionShare: parseFloat(commissionShare),
      description,
      requirements: {
        propertyType: propertyType,
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        minArea: parseInt(minArea),
        maxArea: parseInt(maxArea),
        locations: locations
          .split(',')
          .map(loc => loc.trim())
          .filter(loc => loc),
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
      },
    };

    console.log('Updating lead:', leadData);
    try {
      const updatedLead = await updateLead(leadId, leadData);
      console.log('Lead updated successfully:', updatedLead);
      navigate(`/user/lead/${leadId}`, { replace: true });
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('Ошибка при обновлении лида');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <List>
      <Section header="Редактирование лида" footer="Измените информацию о клиенте">
        <Input header="Имя клиента" placeholder="Введите имя" value={name} onChange={e => setName(e.target.value)} />
        <Input
          header="Агент покупателя (%)"
          placeholder="70"
          type="number"
          value={commissionShare}
          onChange={e => setCommissionShare(e.target.value)}
        />

        <Select
          header="Тип недвижимости"
          value={propertyType}
          onChange={e => setPropertyType(e.target.value as 'flat' | 'room' | 'commerce' | 'house' | 'land' | 'garage')}
        >
          {propertyTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          header="Минимальная цена (₽)"
          placeholder="1000000"
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />

        <Input
          header="Максимальная цена (₽)"
          placeholder="5000000"
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />

        <Input
          header="Минимальная площадь (м²)"
          placeholder="30"
          type="number"
          value={minArea}
          onChange={e => setMinArea(e.target.value)}
        />

        <Input
          header="Максимальная площадь (м²)"
          placeholder="100"
          type="number"
          value={maxArea}
          onChange={e => setMaxArea(e.target.value)}
        />

        <Input
          header="Локации"
          placeholder="Москва, Центр, Арбат"
          value={locations}
          onChange={e => setLocations(e.target.value)}
        />

        <Input
          header="Количество спален"
          placeholder="2"
          type="number"
          value={bedrooms}
          onChange={e => setBedrooms(e.target.value)}
        />
      </Section>

      <div style={{ padding: '16px' }}>
        <Button size="l" stretched onClick={handleSubmit}>
          Сохранить изменения
        </Button>
      </div>
    </List>
  );
};
