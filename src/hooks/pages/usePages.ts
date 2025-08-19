import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchPages, 
  fetchPageBySlug, 
  createPage, 
  updatePage, 
  deletePage, 
  incrementPageViews,
  clearError,
  clearCurrentPage,
  resetPages
} from '../../store/features/pages/pagesSlice';
import type { Page } from '../../types';

export const usePages = () => {
  const dispatch = useAppDispatch();
  const { pages, currentPage, loading, error, lastFetched } = useAppSelector((state) => state.pages);

  const handleFetchPages = () => dispatch(fetchPages());
  
  const handleFetchPageBySlug = (slug: string) => dispatch(fetchPageBySlug(slug));
  
  const handleCreatePage = (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => 
    dispatch(createPage(pageData));
  
  const handleUpdatePage = (id: number, pageData: Partial<Page>) => 
    dispatch(updatePage({ id, page: pageData }));
  
  const handleDeletePage = (id: number) => dispatch(deletePage(id));
  
  const handleIncrementPageViews = (slug: string) => dispatch(incrementPageViews(slug));
  
  const handleClearError = () => dispatch(clearError());
  
  const handleClearCurrentPage = () => dispatch(clearCurrentPage());
  
  const handleResetPages = () => dispatch(resetPages());

  return {
    // State
    pages,
    currentPage,
    loading,
    error,
    lastFetched,
    
    // Actions
    fetchPages: handleFetchPages,
    fetchPageBySlug: handleFetchPageBySlug,
    createPage: handleCreatePage,
    updatePage: handleUpdatePage,
    deletePage: handleDeletePage,
    incrementPageViews: handleIncrementPageViews,
    clearError: handleClearError,
    clearCurrentPage: handleClearCurrentPage,
    resetPages: handleResetPages,
  };
};

export default usePages;
