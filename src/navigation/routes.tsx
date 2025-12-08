import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { InitDataPage } from '@/pages/InitDataPage/InitDataPage';
import { LaunchParamsPage } from '@/pages/LaunchParamsPage/LaunchParamsPage.tsx';
import { ThemeParamsPage } from '@/pages/ThemeParamsPage/ThemeParamsPage.tsx';
import { TinderPage } from '@/pages/TinderPage/TinderPage';
import { ResultsPage } from '@/pages/ResultsPage/ResultsPage';
import { MatchObjectPage } from '@/pages/MatchObjectPage/MatchObjectPage';
import { MatchLeadPage } from '@/pages/MatchLeadPage/MatchLeadPage';
import { LeadCreatePage } from '@/pages/LeadCreatePage/LeadCreatePage';
import { LeadEditPage } from '@/pages/LeadEditPage/LeadEditPage';
import { LeadPage } from '@/pages/LeadPage/LeadPage';
import { EstatePage } from '@/pages/EstatePage/EstatePage';

import { ROUTE_PATHS } from '@/navigation/routePaths';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: ROUTE_PATHS.HOME, Component: IndexPage },
  { path: ROUTE_PATHS.LEAD_CREATE, Component: LeadCreatePage, title: 'Создать лида' },
  { path: ROUTE_PATHS.LEAD_EDIT, Component: LeadEditPage, title: 'Редактировать лида' },
  { path: ROUTE_PATHS.LEAD_DETAILS, Component: LeadPage, title: 'Лид' },
  { path: ROUTE_PATHS.ESTATE_DETAILS, Component: EstatePage, title: 'Объект' },
  { path: ROUTE_PATHS.TINDER, Component: TinderPage },
  { path: ROUTE_PATHS.LEAD_MATCHES, Component: MatchLeadPage },
  { path: ROUTE_PATHS.OBJECT_MATCHES, Component: MatchObjectPage },
  { path: ROUTE_PATHS.RESULTS, Component: ResultsPage },
  { path: ROUTE_PATHS.INIT_DATA, Component: InitDataPage, title: 'Init Data' },
  { path: ROUTE_PATHS.THEME_PARAMS, Component: ThemeParamsPage, title: 'Theme Params' },
  { path: ROUTE_PATHS.LAUNCH_PARAMS, Component: LaunchParamsPage, title: 'Launch Params' },
];
