import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DynamicPage from '../../components/DynamicPage/DynamicPage';

// Mock the usePages hook
vi.mock('../../hooks/pages/usePages', () => ({
  usePages: () => ({
    currentPage: null,
    loading: true,
    error: null,
    fetchPageBySlug: vi.fn(),
    incrementPageViews: vi.fn(),
    clearCurrentPage: vi.fn(),
  })
}));

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((content) => content)
  }
}));

describe('DynamicPage Component', () => {
  const renderWithRouter = (slug = 'test-slug') => {
    return render(
      <MemoryRouter initialEntries={[`/pages/${slug}`]}>
        <DynamicPage />
      </MemoryRouter>
    );
  };

  it('renders loading state correctly', () => {
    renderWithRouter();
    
    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });

  it('renders without crashing when no slug provided', () => {
    render(
      <MemoryRouter initialEntries={['/pages/']}>
        <DynamicPage />
      </MemoryRouter>
    );
    
    // Should either show loading or navigate
    expect(document.body).toBeInTheDocument();
  });
});
