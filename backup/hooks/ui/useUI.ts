import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setLoading,
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setApiConnected,
  addNotification,
  removeNotification,
  clearNotifications
} from '../../store/features/ui';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const notifications = useAppSelector((state) => state.ui.notifications);
  const theme = useAppSelector((state) => state.ui.theme);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const apiConnected = useAppSelector((state) => state.ui.apiConnected);

  return {
    isLoading,
    notifications,
    theme,
    sidebarOpen,
    apiConnected,
    actions: {
      setLoading: (loading: boolean) => dispatch(setLoading(loading)),
      setTheme: (theme: 'light' | 'dark') => dispatch(setTheme(theme)),
      toggleTheme: () => dispatch(toggleTheme()),
      setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
      toggleSidebar: () => dispatch(toggleSidebar()),
      setApiConnected: (connected: boolean) => dispatch(setApiConnected(connected)),
      addNotification: (notification: any) => dispatch(addNotification(notification)),
      removeNotification: (id: string) => dispatch(removeNotification(id)),
      clearNotifications: () => dispatch(clearNotifications()),
    },
  };
};
