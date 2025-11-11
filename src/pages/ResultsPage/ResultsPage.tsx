import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Section, Cell, List, Button } from '@telegram-apps/telegram-ui';
import { ThumbsUp, ThumbsDown, DollarSign, Home } from 'lucide-react';
import type { Lead, RealEstateObject } from '@/types/entity';
import './ResultsPage.css';

interface ResultsState {
  sourceEntity: Lead | RealEstateObject;
  total: number;
  liked: (Lead | RealEstateObject)[];
  disliked: (Lead | RealEstateObject)[];
  customShare: (Lead | RealEstateObject)[];
}

export const ResultsPage: FC = () => {
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

  const { sourceEntity, total, liked, disliked, customShare } = state;
  const isLead = sourceEntity.type === 'lead';

  return (
    <div className="results-page">
      <div className="results-page__header">
        <h2 className="results-page__title">Результаты подбора</h2>
        <p className="results-page__subtitle">
          {isLead 
            ? `Для лида: ${sourceEntity.name}`
            : `Для объекта: ${sourceEntity.name}`
          }
        </p>
      </div>

      <div className="results-page__stats">
        <div className="results-page__stat">
          <div className="results-page__stat-value">{total}</div>
          <div className="results-page__stat-label">Всего просмотрено</div>
        </div>
        <div className="results-page__stat results-page__stat--success">
          <div className="results-page__stat-value">{liked.length}</div>
          <div className="results-page__stat-label">Лайков</div>
        </div>
        <div className="results-page__stat results-page__stat--warning">
          <div className="results-page__stat-value">{customShare.length}</div>
          <div className="results-page__stat-label">Своя доля</div>
        </div>
        <div className="results-page__stat results-page__stat--danger">
          <div className="results-page__stat-value">{disliked.length}</div>
          <div className="results-page__stat-label">Дизлайков</div>
        </div>
      </div>

      <List>
        {liked.length > 0 && (
          <Section header="Понравились" footer="Эти варианты вам подходят">
            {liked.map((item) => (
              <Cell
                key={item.id}
                before={<ThumbsUp size={20} color="var(--tgui--link_color)" />}
                subtitle={item.type === 'lead' 
                  ? `${(item as Lead).requirements.minPrice.toLocaleString()} - ${(item as Lead).requirements.maxPrice.toLocaleString()} ₽`
                  : `${(item as RealEstateObject).attributes.price.toLocaleString()} ₽`
                }
              >
                {item.name}
              </Cell>
            ))}
          </Section>
        )}

        {customShare.length > 0 && (
          <Section header="Своя доля комиссии" footer="Вы предложили свои условия">
            {customShare.map((item) => (
              <Cell
                key={item.id}
                before={<DollarSign size={20} color="#ff9500" />}
                subtitle={item.type === 'lead' 
                  ? `Комиссия покупателя: ${(item as Lead).commissionShare}%`
                  : `Комиссия покупателя: ${(item as RealEstateObject).commissionShare}%`
                }
              >
                {item.name}
              </Cell>
            ))}
          </Section>
        )}

        {disliked.length > 0 && (
          <Section header="Не подошли" footer="Эти варианты вам не понравились">
            {disliked.map((item) => (
              <Cell
                key={item.id}
                before={<ThumbsDown size={20} color="#ff3b30" />}
              >
                {item.name}
              </Cell>
            ))}
          </Section>
        )}
      </List>

      <div className="results-page__actions">
        <Button
          size="l"
          stretched
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          <span>Вернуться на главную</span>
        </Button>
      </div>
    </div>
  );
};
