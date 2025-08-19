import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../test-utils'
import Home from '../../pages/Home/Home'

// Mock the hooks and services
vi.mock('../../hooks/useHomeDataRedux', () => ({
  useHomeDataRedux: vi.fn(() => ({
    data: {
      benefits: [],
      processSteps: [],
      testimonials: [],
      heroSlides: []
    },
    loading: false,
    error: null,
    apiConnected: true,
    refetch: vi.fn()
  }))
}))

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(() => ({}))
}))

describe('Home Page', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders home page content', () => {
    render(<Home />)
    
    // Look for the home container
    const homeContainer = screen.getByText('Why Choose Higgs Boson Consultancy?')
    expect(homeContainer).toBeInTheDocument()
  })

  it('loads without crashing', () => {
    expect(() => {
      render(<Home />)
    }).not.toThrow()
  })

  it('displays loading state', async () => {
    const { useHomeDataRedux } = await import('../../hooks/useHomeDataRedux')
    vi.mocked(useHomeDataRedux).mockReturnValue({
      data: { benefits: [], processSteps: [], testimonials: [], heroSlides: [] },
      loading: true,
      error: null,
      apiConnected: true,
      refetch: vi.fn()
    })

    render(<Home />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error state', async () => {
    const { useHomeDataRedux } = await import('../../hooks/useHomeDataRedux')
    vi.mocked(useHomeDataRedux).mockReturnValue({
      data: { benefits: [], processSteps: [], testimonials: [], heroSlides: [] },
      loading: false,
      error: 'Test error',
      apiConnected: false,
      refetch: vi.fn()
    })

    render(<Home />)
    
    expect(screen.getByText('Error Loading Content')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
})
