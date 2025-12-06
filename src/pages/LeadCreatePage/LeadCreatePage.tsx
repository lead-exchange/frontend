import { createLead } from '@/requests/entities';
import { USER_ID } from '@/services/entityService';
import { leadStore } from '@/stores/leadStore';
import { Section, Input, Button, List, Select } from '@telegram-apps/telegram-ui';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const propertyTypeOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'room', label: 'Комната' },
  { value: 'commerce', label: 'Коммерция' },
  { value: 'house', label: 'Загородка' },
  { value: 'land', label: 'Участок' },
  { value: 'garage', label: 'Машиноместо/гараж' },
];

export const LeadCreatePage: FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [commissionShare, setCommissionShare] = useState('');
  const [propertyType, setPropertyType] = useState<'flat' | 'room' | 'commerce' | 'house' | 'land' | 'garage'>('flat');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [locations, setLocations] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSubmit = async () => {
    const leadData = {
      userId: USER_ID, // TODO
      name,
      commissionShare: parseFloat(commissionShare),
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
        bedrooms: parseInt(bedrooms),
      },
    };
    console.log('Creating lead:', leadData);
    try {
      const createLeadData = await createLead(leadData);
      leadStore.addLead(createLeadData);

      console.log('Lead created successfully:', createLeadData);
      navigate(`/user/lead/${createLeadData.id}`, { replace: true });
    } catch (error) {
      console.error('Failed to create lead:', error);
      alert('Ошибка при создании лида');
    }
  };

  return (
    <List>
      <Section header="Создание лида" footer="Заполните основную информацию о клиенте">
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
          Создать лида
        </Button>
      </div>
    </List>
  );
};
