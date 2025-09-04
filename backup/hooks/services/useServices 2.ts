import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setServicesLoading,
  setServicesError,
  clearServicesError,
  clearServices,
  resetServices,
  fetchServices,
  createService,
  updateService,
  deleteService
} from '../../store/features/services';

export const useServices = () => {
  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.services.services);
  const loading = useAppSelector((state) => state.services.loading);
  const error = useAppSelector((state) => state.services.error);
  const lastFetched = useAppSelector((state) => state.services.lastFetched);

  return {
    services,
    loading,
    error,
    lastFetched,
    actions: {
      fetch: () => dispatch(fetchServices()),
      create: (service: any) => dispatch(createService(service)),
      update: (id: number, service: any) => dispatch(updateService({ id, service })),
      delete: (id: number) => dispatch(deleteService(id)),
      setLoading: (loading: boolean) => dispatch(setServicesLoading(loading)),
      setError: (error: string | null) => dispatch(setServicesError(error)),
      clearError: () => dispatch(clearServicesError()),
      clearServices: () => dispatch(clearServices()),
      reset: () => dispatch(resetServices()),
    },
  };
};
