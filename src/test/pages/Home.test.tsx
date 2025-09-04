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

  it('displays static content correctly', async () => {
    // Home component now uses static data, so no mocking needed
    render(<Home />)
    
    // Test that the component renders without errors
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
