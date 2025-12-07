import { FC } from 'react';
import { demoUsers, DemoUserKey } from '@/types/demo';

interface DemoUserSwitcherProps {
  currentUser: string;
}

export const DemoUserSwitcher: FC<DemoUserSwitcherProps> = ({ currentUser }) => {
  const handleUserSwitch = (userKey: DemoUserKey) => {
    if (typeof window === 'undefined') return;
    
    try {
      const url = new URL(window.location.href);
      if (userKey === 'bob') {
        url.searchParams.delete('demo_user');
      } else {
        url.searchParams.set('demo_user', userKey);
      }
      window.location.href = url.toString();
    } catch (error) {
      console.error('Failed to switch user:', error);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      padding: '10px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Демо-пользователь:</div>
      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        {Object.entries(demoUsers).map(([key, user]) => (
          <button
            key={key}
            onClick={() => handleUserSwitch(key as DemoUserKey)}
            style={{ 
              background: currentUser === key ? '#007AFF' : '#333',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              fontSize: '11px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {user.user.username} (ID: {user.user.id})
          </button>
        ))}
      </div>
    </div>
  );
};
