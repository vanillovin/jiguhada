import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: Infinity,
      refetchOnWindowFocus: false, // window 가 다시 포커스 될 때
      // refetchOnMount // 쿼리의 새 인스턴스가 마운트 될 때
      // refetchOnReconnect // 네트워크가 끊어졌다가 다시 연결될 때
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);
