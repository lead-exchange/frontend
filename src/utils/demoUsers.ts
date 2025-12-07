import { DemoUser, DemoUserKey, demoUsers } from '@/types/demo';

export const getCurrentDemoUser = (): DemoUser => {
  if (typeof window === 'undefined') {
    return demoUsers.bob;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('demo_user');
    
    if (userParam && Object.keys(demoUsers).includes(userParam)) {
      return demoUsers[userParam as DemoUserKey];
    }
  } catch (error) {
    console.error('Failed to parse demo user from URL:', error);
  }
  
  return demoUsers.bob;
};
