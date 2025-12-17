import { Section, Cell, List, Spinner, TabsList, Button } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import { User as UserIcon, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { requestContact, init, isTMA } from '@telegram-apps/sdk';

import { Link } from '@/components/Link/Link.tsx';
import type { Lead, RealEstateObject } from '@/types/entity';
import type { User } from '@/types/user';
import { observer } from 'mobx-react-lite';
import { leadStore } from '@/stores/leadStore';
import { realEstateStore } from '@/stores/realEstateStore';
import { setUserAcceptedTerms, setUserPhone } from '@/requests/user';
import { userStore } from '@/stores/userStore';
import { getLeads, getRealEstateObjects } from '@/requests/entities';
import { getEstateName } from '@/utils/estateHelpers';
import { useDevMode } from '@/hooks/useDevMode';
import { isInsideMiniApp } from '@/index';
import { indexTabStore } from '@/stores/tabStore';

import './IndexPage.css';

if (isTMA()) {
  init();
}

type RequestedContact = Awaited<ReturnType<typeof requestContact>>;

const requestContactAction = async (): Promise<string> => {
  try {
    const timeoutPromise = new Promise<RequestedContact>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - user likely clicked outside')), 30000);
    });

    if (isInsideMiniApp) {
      const contacts = await Promise.race([requestContact(), timeoutPromise]);
      return contacts.contact.phone_number;
    } else {
      return '79999999999';
    }
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const IndexPage: FC = observer(() => {
  const debug = useDevMode();

  const navigate = useNavigate();

  const [isOfferSigned, setIsOfferSigned] = useState<boolean>(false);
  const [isOfferCheckboxSelected, setIsOfferCheckboxSelected] = useState<boolean>(false);

  const [isPhoneProvided, setIsPhoneProvided] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);

  const activeTab = indexTabStore.tab;

  useEffect(() => {
    const signTerms = async () => {
      setLoading(true);

      try {
        const user: User = await userStore.getUser();
        setLoading(false);

        if (user.offer1Signed && user.offer2Signed) {
          setIsOfferSigned(true);
        } else {
          return;
        }
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        setLoading(false);
        return;
      }
    };

    signTerms();
  }, []);

  useEffect(() => {
    if (!isOfferSigned) {
      return;
    }

    const getPhone = async () => {
      try {
        const user: User = await userStore.getUser();

        if (user.phone && user.phone !== '') {
          setIsPhoneProvided(true);
          return;
        }

        const phone = await requestContactAction();

        if (phone && phone !== '') {
          await setUserPhone(phone);
          userStore.setUserPhone(phone);
          setIsPhoneProvided(true);
          return;
        }

        WebApp.showPopup(
          {
            buttons: [{ type: 'close' }],
            message: 'Для того, чтобы пользоваться сервисом, вы должны предоставить доступ к своему номеру телефона',
          },
          () => {
            WebApp.close();
          }
        );
      } catch (error) {
        console.error('Ошибка при запросе телефона:', error);
        return;
      }
    };

    getPhone();
  }, [isOfferSigned]);

  useEffect(() => {
    if (!isOfferSigned || !isPhoneProvided) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        if (activeTab === 'leads') {
          const data = await getLeads();
          console.info(data);
          leadStore.setLeads(data);
        } else {
          const data = await getRealEstateObjects();
          realEstateStore.setObjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, isOfferSigned, isPhoneProvided]);

  const handleEntityClick = (item: Lead | RealEstateObject) => {
    if (activeTab === 'leads') {
      navigate(`/user/lead/${item.id}`);
    } else {
      navigate(`/user/estate/${item.id}`);
    }
  };

  const handleCreateLead = () => {
    navigate('/lead/create');
  };

  const entitiesLength = activeTab === 'leads' ? leadStore.leads.length : realEstateStore.objects.length;

  if (loading && (!isOfferSigned || !isPhoneProvided)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Spinner size="m" />
      </div>
    );
  }

  if (!isOfferSigned) {
    return (
      <>
        <div className="terms-modal">
          <div style={{ display: 'flex', gap: '5px' }}>
            <input
              style={{ width: '20px', height: '20px' }}
              type="checkbox"
              checked={isOfferCheckboxSelected}
              onChange={e => setIsOfferCheckboxSelected(e.target.checked)}
            />{' '}
            <span>
              {' '}
              Я прочитал(a) и согласен(на) с{' '}
              <a style={{ textDecoration: 'underline' }} onClick={() => WebApp.openLink('https://aiplus.ru/privacy')}>
                публичной офертой
              </a>{' '}
              и{' '}
              <a style={{ textDecoration: 'underline' }} onClick={() => WebApp.openLink('https://aiplus.ru/agreement')}>
                согласием на обработку персональных данных
              </a>
            </span>
          </div>

          <Button
            disabled={!isOfferCheckboxSelected}
            onClick={async () => {
              await setUserAcceptedTerms();
              setIsOfferSigned(true);
              userStore.setUserAcceptedTerms();
            }}
          >
            Подтвердить
          </Button>
        </div>
      </>
    );
  }

  if (!isPhoneProvided) {
    return <></>;
  }

  return (
    <>
      <TabsList className="tab-header">
        <TabsList.Item selected={activeTab === 'leads'} onClick={() => indexTabStore.setTab('leads')}>
          Лиды
        </TabsList.Item>
        <TabsList.Item selected={activeTab === 'objects'} onClick={() => indexTabStore.setTab('objects')}>
          Объекты
        </TabsList.Item>
      </TabsList>

      <List>
        <Section>
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
                {item.type === 'lead' ? item.name : getEstateName(item.attributes)}
              </Cell>
            ))
          )}

          {loading || entitiesLength > 0 || (
            <div style={{ width: '90%', margin: 'auto', padding: '8px 0px 8px 0px' }}>
              {activeTab === 'leads' ? (
                <p>Добавьте лидов по кнопке "Создать лида"</p>
              ) : (
                <p>Мы не смогли найти ваши объекты недвижимости - добавьте их в CRM и они появятся в системе</p>
              )}
            </div>
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
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            padding: '16px',
            paddingBottom: '24px',
          }}
        >
          <Button size="l" onClick={handleCreateLead}>
            Создать лида
          </Button>
        </div>
      )}
    </>
  );
});
