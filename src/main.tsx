import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@shared/components/feedback';
import { handleApiError } from '@shared/utils/errorHandler';

const logError = (error: unknown, type: 'Query' | 'Mutation') => {
  const apiError = handleApiError(error);
  console.error(`${type} error:`, apiError.message);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});

queryClient.getQueryCache().subscribe(event => {
  if (event?.type === 'updated' && event.query.state.error) {
    logError(event.query.state.error, 'Query');
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event?.type === 'updated' && event.mutation.state.error) {
    logError(event.mutation.state.error, 'Mutation');
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
