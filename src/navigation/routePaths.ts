export const ROUTE_PATHS = {
  HOME: '/',
  LEAD_CREATE: '/lead/create',
  LEAD_EDIT: '/user/lead/:leadId/edit',
  LEAD_DETAILS: '/user/lead/:leadId',
  ESTATE_DETAILS: '/user/estate/:estateId',
  TINDER: '/tinder/:type/:id',
  LEAD_MATCHES: '/matches/lead/:id',
  OBJECT_MATCHES: '/matches/object/:id',
  RESULTS: '/results',
  INIT_DATA: '/init-data',
  THEME_PARAMS: '/theme-params',
  LAUNCH_PARAMS: '/launch-params',
} as const;

export const AppRoutes = {
  lead: {
    details: (id: string | number) => `/user/lead/${id}`,
    edit: (id: string | number) => `/user/lead/${id}/edit`,
  },
  estate: {
    details: (id: string | number) => `/user/estate/${id}`,
  },
  tinder: (type: string, id: string | number) => `/tinder/${type}/${id}`,
  matches: {
    lead: (id: string | number) => `/matches/lead/${id}`,
    object: (id: string | number) => `/matches/object/${id}`,
  },
} as const;

export const MATCH_TYPES = {
  LEAD: 'lead',
  OBJECT: 'object',
} as const;
