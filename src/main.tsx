import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
// tailwind base style? 에 먹혀서..? 옮김
import '@toast-ui/editor/dist/toastui-editor.css';
import { QueryClient, QueryClientProvider } from 'react-query';

// Create a client
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    {/* Provide the client to your App */}
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);
