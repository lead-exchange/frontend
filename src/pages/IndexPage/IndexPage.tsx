import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';

import './IndexPage.css';

export const IndexPage: FC = () => (
  <div className='index'>
    <section className='index__hero'>
      <div className='index__hero-inner'>
        <div className='index__hero-text'>
          <span className='index__badge'>Telegram Mini App</span>
          <h1 className='index__title'>Биржа лидов</h1>
          <p className='index__subtitle'>
            Монетизируйте неиспользованные контакты и находите покупателей для своих объектов в
            защищённой экосистеме риелторских агентств.
          </p>
          <div className='index__actions'>
            <a className='index__action index__action_primary' href='#features'>Начать работу</a>
            <a className='index__action index__action_secondary' href='#workflow'>Как это работает</a>
          </div>
        </div>
        <div className='index__hero-visual' aria-hidden='true'>
          <div className='index__halo index__halo_top'/>
          <div className='index__halo index__halo_bottom'/>
          <div className='index__hero-card index__hero-card_primary'>
            <span className='index__hero-card-label'>AI мэтчинг</span>
            <strong className='index__hero-card-title'>87%</strong>
            <p className='index__hero-card-text'>точность рекомендации объекта по профилю лида</p>
          </div>
          <div className='index__hero-card index__hero-card_secondary'>
            <span className='index__hero-card-label'>Лиды в обмен</span>
            <p className='index__hero-card-text'>Передавайте «холодных» клиентов коллегам и получайте вознаграждение.</p>
          </div>
        </div>
      </div>
    </section>

    <section className='index__section index__features' id='features'>
      <div className='index__section-header'>
        <h2 className='index__section-title'>Почему Биржа Лидов</h2>
        <p className='index__section-subtitle'>Инструменты, которые помогают агентствам закрывать больше сделок</p>
      </div>
      <div className='index__feature-list'>
        <article className='index__feature'>
          <span className='index__feature-icon'>⚡</span>
          <h3 className='index__feature-title'>Мгновенный доступ к лид-пулу</h3>
          <p className='index__feature-text'>Получайте подборку проверенных лидов от партнёров и расширяйте воронку продаж без дополнительных затрат на рекламу.</p>
        </article>
        <article className='index__feature'>
          <span className='index__feature-icon'>🤝</span>
          <h3 className='index__feature-title'>Прозрачные сделки между агентствами</h3>
          <p className='index__feature-text'>Управляйте правилами обмена, фиксируйте вознаграждение и контролируйте статус сделки прямо в мини-приложении.</p>
        </article>
        <article className='index__feature'>
          <span className='index__feature-icon'>🧠</span>
          <h3 className='index__feature-title'>ИИ-помощник в подборе</h3>
          <p className='index__feature-text'>Алгоритм анализирует профиль клиента и предлагает релевантные объекты, экономя время команд и повышая конверсию.</p>
        </article>
      </div>
    </section>

    <section className='index__section index__workflow' id='workflow'>
      <div className='index__section-header'>
        <h2 className='index__section-title'>Как это работает</h2>
        <p className='index__section-subtitle'>Всё просто и безопасно — от публикации лида до выплаты вознаграждения</p>
      </div>
      <ol className='index__workflow-list'>
        <li className='index__workflow-step'>Опубликуйте неактуальный лид и укажите желаемое вознаграждение.</li>
        <li className='index__workflow-step'>Получите подборку подходящих объектов и команд, готовых выкупить контакт.</li>
        <li className='index__workflow-step'>Отслеживайте статус сделки и чатитесь с партнёрами в одном окне.</li>
        <li className='index__workflow-step'>Получайте оплату автоматически после закрытия сделки.</li>
      </ol>
    </section>

    <section className='index__section index__dev-tools'>
      <div className='index__section-header'>
        <h2 className='index__section-title'>Инструменты разработчика</h2>
        <p className='index__section-subtitle'>Служебные страницы помогут проверить параметры запуска мини-приложения</p>
      </div>
      <div className='index__dev-links'>
        <Link className='index__dev-link' to='/init-data'>Init Data</Link>
        <Link className='index__dev-link' to='/launch-params'>Launch Parameters</Link>
        <Link className='index__dev-link' to='/theme-params'>Theme Parameters</Link>
      </div>
    </section>
  </div>
);
