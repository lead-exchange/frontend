import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Section, Cell, List, Button } from '@telegram-apps/telegram-ui';
import { ThumbsUp, ThumbsDown, DollarSign, Home } from 'lucide-react';
import type { EntityType, Lead, RealEstateObject } from '@/types/entity';
import './ResultsPage.css';
import { observer } from 'mobx-react-lite';
import { tinderResultsStore } from '@/stores/tinderResultsStore';

interface ResultsState {
  entityName: string;
  entityType: EntityType;
  total: number;
  liked: (Lead | RealEstateObject)[];
  disliked: (Lead | RealEstateObject)[];
  customShare: (Lead | RealEstateObject)[];
}

export const ResultsPage: FC = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState;

  if (!state) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Нет данных о результатах</p>
        <Button onClick={() => navigate('/')}>На главную</Button>
      </div>
    );
  }

  const { entityName, entityType } = state;

  const isLead = entityType === 'lead';

  if (tinderResultsStore.total === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="results-page__no-recs" style={{ paddingBottom: '10px' }}>
          Нет рекомендаций по {isLead ? 'лиду' : 'объекту'}
        </div>
        <Button onClick={() => navigate('/')}>На главную</Button>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-page__header">
        <h2 className="results-page__title">Результаты подбора</h2>
        <p className="results-page__subtitle">{isLead ? `Для лида: ${entityName}` : `Для объекта: ${entityName}`}</p>
      </div>

      <div className="results-page__stats">
        <div className="results-page__stat">
          <div className="results-page__stat-value">{tinderResultsStore.total}</div>
          <div className="results-page__stat-label">Всего просмотрено</div>
        </div>
        <div className="results-page__stat results-page__stat--success">
          <div className="results-page__stat-value">{tinderResultsStore.likedItems.length}</div>
          <div className="results-page__stat-label">Лайков</div>
        </div>
        <div className="results-page__stat results-page__stat--warning">
          <div className="results-page__stat-value">{tinderResultsStore.customShareItems.length}</div>
          <div className="results-page__stat-label">Своя доля</div>
        </div>
        <div className="results-page__stat results-page__stat--danger">
          <div className="results-page__stat-value">{tinderResultsStore.dislikedItems.length}</div>
          <div className="results-page__stat-label">Дизлайков</div>
        </div>
      </div>

      <List>
        {tinderResultsStore.likedItems.length > 0 && (
          <Section header="Понравились" footer="Эти варианты вам подходят">
            {tinderResultsStore.likedItems.map(item => (
              <Cell
                key={item.id}
                before={<ThumbsUp size={20} color="var(--tgui--link_color)" />}
                subtitle={
                  item.type === 'lead'
                    ? `${(item as Lead).requirements.minPrice.toLocaleString()} - ${(
                        item as Lead
                      ).requirements.maxPrice.toLocaleString()} ₽`
                    : `${(item as RealEstateObject).attributes.price.toLocaleString()} ₽`
                }
              >
                {item.type === 'lead' ? item.name : item.attributes.title}
              </Cell>
            ))}
          </Section>
        )}

        {tinderResultsStore.customShareItems.length > 0 && (
          <Section header="Своя доля комиссии" footer="Вы предложили свои условия">
            {tinderResultsStore.customShareItems.map(item => (
              <Cell
                key={item.id}
                before={<DollarSign size={20} color="#ff9500" />}
                subtitle={`Комиссия покупателя: ${item.commissionShare}%`}
              >
                {item.type === 'lead' ? item.name : item.attributes.title}
              </Cell>
            ))}
          </Section>
        )}

        {tinderResultsStore.dislikedItems.length > 0 && (
          <Section header="Не подошли" footer="Эти варианты вам не понравились">
            {tinderResultsStore.dislikedItems.map(item => (
              <Cell key={item.id} before={<ThumbsDown size={20} color="#ff3b30" />}>
                {item.type === 'lead' ? item.name : item.attributes.title}
              </Cell>
            ))}
          </Section>
        )}
      </List>
      <div className="results-page__actions">
        <Button before={<Home size={20} />} size="l" stretched onClick={() => navigate('/')}>
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
});
