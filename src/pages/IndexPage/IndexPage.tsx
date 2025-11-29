import { Section, Cell, List, Spinner, TabsList, Button } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import { User as UserIcon, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';

import { Link } from '@/components/Link/Link.tsx';
import { USER_ID } from '@/services/entityService';
import type { Lead, RealEstateObject } from '@/types/entity';
import { observer } from 'mobx-react-lite';
import { leadStore } from '@/stores/leadStore';
import { realEstateStore } from '@/stores/realEstateStore';
import { getUserByTgId } from '@/requests/user';
import { userStore } from '@/stores/userStore';
import { getLeads, getRealEstateObjects } from '@/requests/entities';

type TabType = 'leads' | 'objects';

export const IndexPage: FC = observer(() => {
  const debug = WebApp.initDataUnsafe.start_param === 'debug';

  const tgUserId = WebApp.initDataUnsafe.user?.id;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let user;
      try {
        user = tgUserId ? await getUserByTgId(tgUserId) : { id: USER_ID };
      } catch (e) {
        console.error('Failed to fetch user:', e);
        user = { id: USER_ID };
      }
      userStore.setUser(user);

      try {
        if (activeTab === 'leads') {
          const data = await getLeads(user.id);
          console.log(data);
          leadStore.setLeads(data);
        } else {
          const data = await getRealEstateObjects(user.id);
          realEstateStore.setObjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const handleEntityClick = (item: Lead | RealEstateObject) => {
    if (activeTab === 'leads') {
      navigate(`/user/lead/${item.id}`);
    } else {
      navigate(`/user/object/${item.id}`);
    }
  };

  const handleCreateLead = () => {
    navigate('/lead/create');
  };

  return (
    <>
      <TabsList>
        <TabsList.Item selected={activeTab === 'leads'} onClick={() => setActiveTab('leads')}>
          Лиды
        </TabsList.Item>
        <TabsList.Item selected={activeTab === 'objects'} onClick={() => setActiveTab('objects')}>
          Объекты
        </TabsList.Item>
      </TabsList>

      <List>
        <Section
          header={activeTab === 'leads' ? 'Лиды' : 'Объекты'}
          footer={
            activeTab === 'leads'
              ? 'Нажмите на лид, чтобы начать подбор объектов'
              : 'Нажмите на объект, чтобы начать подбор лидов'
          }
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <Spinner size="m" />
            </div>
          ) : (
            (activeTab === 'leads' ? leadStore.leads : realEstateStore.objects).map(item => (
              <Cell
                key={item.id}
                before={
                  activeTab === 'leads' ? (
                    <UserIcon color="var(--button_color)" />
                  ) : (
                    <Building2 color="var(--button_color)" />
                  )
                }
                after={<ChevronRight />}
                onClick={() => handleEntityClick(item)}
              >
                {item.type === 'lead' ? item.name : item.attributes.title}
              </Cell>
            ))
          )}
        </Section>
        {debug && (
          <Section
            header="Application Launch Data"
            footer="These pages help developer to learn more about current launch information"
          >
            <Link to="/init-data">
              <Cell subtitle="User data, chat information, technical data">Init Data</Cell>
            </Link>
            <Link to="/launch-params">
              <Cell subtitle="Platform identifier, Mini Apps version, etc.">Launch Parameters</Cell>
            </Link>
            <Link to="/theme-params">
              <Cell subtitle="Telegram application palette information">Theme Parameters</Cell>
            </Link>
          </Section>
        )}
      </List>
      
      {activeTab === 'leads' && (
        <div style={{ padding: '16px', paddingBottom: '24px' }}>
          <Button 
          size="l"
          onClick={handleCreateLead}
          >
            Создать лида
          </Button>
        </div>
      )}
    </>
  );
});
