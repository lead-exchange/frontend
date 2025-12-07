import { type FC, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { DemoUserSwitcher } from '@/components/DemoUserSwitcher/DemoUserSwitcher';
import { getCurrentDemoUser } from '@/utils/demoUsers';
import { useDevMode } from '@/hooks/useDevMode';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>{error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error)}</code>
    </blockquote>
  </div>
);

const VersionBadge: FC = () => {
  const mode = import.meta.env.MODE;
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <div
      style={{
        position: 'fixed',
        right: 8,
        bottom: 8,
        zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: 12,
        lineHeight: 1.2,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}
    >
      mode={mode} base={baseUrl}
    </div>
  );
};

const Inner: FC = () => {
  const isDevMode = useDevMode();

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (isDevMode) {
      import('eruda').then(lib => lib.default.init());
    }
  }, [isDevMode]);

  return (
    <>
      <App />
      {isDevMode && <VersionBadge />}
      {isDevMode && !WebApp.initData?.trim() && (
        <DemoUserSwitcher 
          currentUser={getCurrentDemoUser().user.username}
        />
      )}
    </>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner />
  </ErrorBoundary>
);
