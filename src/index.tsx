import ReactDOM from 'react-dom/client';
import '@twa-dev/sdk';

import { Root } from '@/components/Root';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';
import { init, isTMA, postEvent } from '@telegram-apps/sdk';

if (isTMA()) {
  init();
  postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
} else {
  console.log('Not posting event because we are outside MiniApp');
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
