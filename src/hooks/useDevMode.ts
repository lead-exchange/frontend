import { useMemo } from 'react';
import WebApp from '@twa-dev/sdk';

export const useDevMode = (): boolean => {
  return useMemo(() => {
    return import.meta.env.VITE_DEV_MODE === 'true' || WebApp.initDataUnsafe.start_param === 'debug';
  }, []);
};
