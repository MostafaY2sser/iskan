
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthProvider } from '@/providers/AuthProvider';
import { RoleProvider } from '@/providers/RoleProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { DirectionProvider } from '@/contexts/DirectionContext';
import { DocumentStatusProvider } from '@/contexts/DocumentStatusContext';
import DevApiLogger from '@/components/DevApiLogger';

import { router } from '@/app/router';
import { LanguageProvider } from './providers/LanguageProvider';
import SeoMeta from './components/SeoMeta';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  console.log('App component rendering - no DirectionWrapper');
  
  return (
    <>
      <SeoMeta />
   
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <LanguageProvider>
          <DirectionProvider>
            <ThemeProvider>
              <AuthProvider>
                <DocumentStatusProvider>
                  <RoleProvider>
                    <TooltipProvider>
                      <RouterProvider router={router} />
                      <Toaster />
                      <Sonner />
                      <DevApiLogger />
                    </TooltipProvider>
                  </RoleProvider>
                </DocumentStatusProvider>
              </AuthProvider>
            </ThemeProvider>
          </DirectionProvider>
          </LanguageProvider>
        </I18nProvider>
      </QueryClientProvider>
     </>
  );
};

export default App;
