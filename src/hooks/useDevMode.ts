import { useMemo } from 'react';
import WebApp from '@twa-dev/sdk';

export const useDevMode = (): boolean => {
  return useMemo(() => {
    // Проверяем, что мы в браузере и WebApp доступен
    if (typeof window === 'undefined' || !WebApp.initDataUnsafe) {
      return false;
    }
    
    return import.meta.env.VITE_DEV_MODE === 'true' || WebApp.initDataUnsafe.start_param === 'debug';
  }, []);
};
