import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { AuthProvider } from '../contexts/AuthProvider';
import { DropdownProvider } from '../contexts/DropdownContext';
import ModalProviders from './ModalProviders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

console.log(import.meta.env.DEV);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <DropdownProvider>
              <ModalProviders>{children}</ModalProviders>
            </DropdownProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
