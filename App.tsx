
import { useEffect, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { useThemeStore } from './store/themeStore';
import { useReminders } from './hooks/useReminders';
import FullScreenLoader from './components/common/FullScreenLoader';
import { useAuthStore } from './store/authStore';
import { API_ENDPOINTS, apiClient } from './services/apiConfig';

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

  useEffect(() => {
    const tryRefresh = async () => {
      const auth = useAuthStore.getState();
      const { refreshToken, token, setToken, logout } = auth;

      if (!refreshToken || token) return;

      try {
        const res = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, {
          refreshToken,
        });

        setToken(res.data.accessToken, res.data.refreshToken);

      } catch (err) {
        logout();
        console.warn("Refresh failed on startup");
      }
    };

    tryRefresh();
  }, []);


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