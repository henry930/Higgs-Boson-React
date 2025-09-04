import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test-utils'
import Services from '../../pages/Services/Services'

// Mock the API service
vi.mock('../../services/apiService', () => ({
  apiService: {
    getServices: vi.fn()
  }
}))

// Mock the useServices hook
vi.mock('../../hooks/services/useServices', () => ({
  useServices: vi.fn()
}))

import { useServices } from '../../hooks/services/useServices'

describe('Services Component', () => {
  const mockServices = [
    {
      id: 1,
      title: 'AI-Powered Web Development',
      description: 'Transform your web presence with cutting-edge AI-assisted development.',
      short_description: 'AI-accelerated web development',
      icon: '🚀',
      features: ['React', 'Node.js', 'AI-assisted coding'],
      price_range: '$10,000 - $100,000',
      duration: '2-12 weeks',
      category: 'Web Development',
      order: 1,
      featured: true,
      active: true,
      created_at: '2025-08-19T10:00:00Z',
      updated_at: '2025-08-19T10:00:00Z'
    },
    {
      id: 2,
      title: 'Enterprise AI Solutions',
      description: 'Deploy enterprise-grade AI solutions that transform business operations.',
      short_description: 'Enterprise AI systems',
      icon: '🤖',
      features: ['Machine Learning', 'Natural Language Processing'],
      price_range: '$25,000 - $500,000',
      duration: '4-24 weeks',
      category: 'AI & Machine Learning',
      order: 2,
      featured: true,
      active: true,
      created_at: '2025-08-19T10:00:00Z',
      updated_at: '2025-08-19T10:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state initially', () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: true,
      error: null,
      lastFetched: null,
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)
    
    expect(screen.getByText('Loading services...')).toBeInTheDocument()
  })

  it('renders services when data is loaded', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('Our Services')).toBeInTheDocument()
      expect(screen.getByText('AI-Powered Web Development')).toBeInTheDocument()
      expect(screen.getByText('Enterprise AI Solutions')).toBeInTheDocument()
    })
  })

  it('renders fallback notification when using fallback data', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: 'API Error',
      lastFetched: null,
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText(/Unable to connect to server/)).toBeInTheDocument()
    })
  })

  it('displays service features correctly', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('Machine Learning')).toBeInTheDocument()
    })
  })

  it('calls fetch action on component mount', () => {
    const mockFetch = vi.fn()
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: null,
      lastFetched: null,
      actions: {
        fetch: mockFetch,
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)
    
    expect(mockFetch).toHaveBeenCalled()
  })

  it('displays price range and duration information for services', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('$10,000 - $100,000')).toBeInTheDocument()
      expect(screen.getByText('2-12 weeks')).toBeInTheDocument()
      expect(screen.getByText('$25,000 - $500,000')).toBeInTheDocument()
      expect(screen.getByText('4-24 weeks')).toBeInTheDocument()
    })
  })

  it('renders the development process section', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('Our Development Process')).toBeInTheDocument()
      expect(screen.getByText('Discovery & Planning')).toBeInTheDocument()
      expect(screen.getByText('AI-Powered Development')).toBeInTheDocument()
      expect(screen.getByText('Testing & Optimization')).toBeInTheDocument()
      expect(screen.getByText('Deployment & Support')).toBeInTheDocument()
    })
  })

  it('renders service icons correctly', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('🚀')).toBeInTheDocument()
      expect(screen.getByText('🤖')).toBeInTheDocument()
    })
  })

  it('renders header section with title and subtitle', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('Our Services')).toBeInTheDocument()
      expect(screen.getByText(/Revolutionizing software development with AI-powered solutions/)).toBeInTheDocument()
    })
  })

  it('handles features as string with comma separation', async () => {
    const serviceWithStringFeatures = [{
      ...mockServices[0],
      features: 'React, Node.js, AI-assisted coding'
    }]

    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: serviceWithStringFeatures,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('AI-assisted coding')).toBeInTheDocument()
    })
  })

  it('does not fetch if services already exist', () => {
    const mockFetch = vi.fn()
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: mockFetch,
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)
    
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('does not fetch if already loading', () => {
    const mockFetch = vi.fn()
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: true,
      error: null,
      lastFetched: null,
      actions: {
        fetch: mockFetch,
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)
    
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('does not fetch if there is an error', () => {
    const mockFetch = vi.fn()
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: 'API Error',
      lastFetched: null,
      actions: {
        fetch: mockFetch,
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)
    
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('renders services without price range and duration when not provided', async () => {
    const servicesWithoutPricing = [{
      ...mockServices[0],
      price_range: '',
      duration: ''
    }]

    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: servicesWithoutPricing,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('AI-Powered Web Development')).toBeInTheDocument()
      expect(screen.queryByText('Price Range:')).not.toBeInTheDocument()
      expect(screen.queryByText('Duration:')).not.toBeInTheDocument()
    })
  })

  it('renders services without features when not provided', async () => {
    const servicesWithoutFeatures = [{
      ...mockServices[0],
      features: []
    }]

    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: servicesWithoutFeatures,
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('AI-Powered Web Development')).toBeInTheDocument()
      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument()
    })
  })

  it('renders empty state when no services are available', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: null,
      lastFetched: Date.now(),
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText('Our Services')).toBeInTheDocument()
      expect(screen.getByText('Our Development Process')).toBeInTheDocument()
      // No service cards should be rendered
      expect(screen.queryByText('AI-Powered Web Development')).not.toBeInTheDocument()
    })
  })

  it('renders fallback data when error occurs and no services loaded', async () => {
    const mockUseServices = vi.mocked(useServices)
    mockUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: 'Network error',
      lastFetched: null,
      actions: {
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearServices: vi.fn(),
        reset: vi.fn()
      }
    })

    render(<Services />)

    await waitFor(() => {
      expect(screen.getByText(/Unable to connect to server/)).toBeInTheDocument()
      // Should show fallback services
      expect(screen.getByText('AI-Powered Web Development')).toBeInTheDocument()
      expect(screen.getByText('Enterprise AI Solutions')).toBeInTheDocument()
      expect(screen.getByText('Mobile App Development')).toBeInTheDocument()
      expect(screen.getByText('Cloud Infrastructure & DevOps')).toBeInTheDocument()
    })
  })
})
