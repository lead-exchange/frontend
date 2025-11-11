import { Section, Cell, List, Spinner, TabsList } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import { User, ChevronRight, Building2 } from 'lucide-react';

import { Link } from '@/components/Link/Link.tsx';
import { fetchLeads, fetchObjects } from '@/services/entityService';
import type { Lead, Object } from '@/types/entity';

type TabType = 'leads' | 'objects';

export const IndexPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'leads') {
          const data = await fetchLeads();
          setLeads(data);
        } else {
          const data = await fetchObjects();
          setObjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  return (
    <>
      <TabsList>
        <TabsList.Item
          selected={activeTab === 'leads'}
          onClick={() => setActiveTab('leads')}
        >Лиды</TabsList.Item>
        <TabsList.Item
          selected={activeTab === 'objects'}
          onClick={() => setActiveTab('objects')}
        >Объекты</TabsList.Item>
      </TabsList>
      
      <List>
        <Section
          header={activeTab === 'leads' ? 'Лиды' : 'Объекты'}
          footer={activeTab === 'leads' ? 'Список лидов' : 'Список объектов'}
        >
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <Spinner size='m' />
            </div>
          ) : (
            (activeTab === 'leads' ? leads : objects).map((item) => (
              <Cell
                key={item.id}
                before={activeTab === 'leads' ? <User color="var(--button_color)" /> : <Building2 color="var(--button_color)" />}
                after={<ChevronRight />}
              >
                {item.name}
              </Cell>
            ))
          )}
        </Section>
        <Section
          header='Application Launch Data'
          footer='These pages help developer to learn more about current launch information'
        >
          <Link to='/init-data'>
            <Cell subtitle='User data, chat information, technical data'>Init Data</Cell>
          </Link>
          <Link to='/launch-params'>
            <Cell subtitle='Platform identifier, Mini Apps version, etc.'>Launch Parameters</Cell>
          </Link>
          <Link to='/theme-params'>
            <Cell subtitle='Telegram application palette information'>Theme Parameters</Cell>
          </Link>
        </Section>
      </List>
    </>
  );
};
