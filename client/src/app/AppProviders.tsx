import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { AuthProvider } from '../contexts/AuthProvider';
import { DropdownProvider } from '../contexts/DropdownContext';
import { ModalProvider } from '../contexts/ModalProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <DropdownProvider>
              <ModalProvider>{children}</ModalProvider>
            </DropdownProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
