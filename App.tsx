
import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { useThemeStore } from './store/themeStore';
import { useReminders } from './hooks/useReminders';
import FullScreenLoader from './components/common/FullScreenLoader';

function App() {
  const theme = useThemeStore((state) => state.theme);
  useReminders();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoader />}>
        <AppRoutes />
      </Suspense>
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;