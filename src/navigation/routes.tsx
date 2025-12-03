import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { InitDataPage } from '@/pages/InitDataPage/InitDataPage';
import { LaunchParamsPage } from '@/pages/LaunchParamsPage/LaunchParamsPage.tsx';
import { ThemeParamsPage } from '@/pages/ThemeParamsPage/ThemeParamsPage.tsx';
import { TinderPage } from '@/pages/TinderPage/TinderPage';
import { ResultsPage } from '@/pages/ResultsPage/ResultsPage';
import { MatchPage } from '@/pages/MatchPage/MatchPage';
import { LeadCreatePage } from '@/pages/LeadCreatePage/LeadCreatePage';
import { LeadEditPage } from '@/pages/LeadEditPage/LeadEditPage';
import { LeadPage } from '@/pages/LeadPage/LeadPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/lead/create', Component: LeadCreatePage, title: 'Создать лида' },
  { path: '/user/lead/:leadId/edit', Component: LeadEditPage, title: 'Редактировать лида' },
  { path: '/user/lead/:leadId', Component: LeadPage, title: 'Лид' },
  { path: '/tinder/:type/:id', Component: TinderPage },
  { path: '/matches/:type/:id', Component: MatchPage },
  { path: '/results', Component: ResultsPage },
  { path: '/init-data', Component: InitDataPage, title: 'Init Data' },
  { path: '/theme-params', Component: ThemeParamsPage, title: 'Theme Params' },
  { path: '/launch-params', Component: LaunchParamsPage, title: 'Launch Params' },
];
