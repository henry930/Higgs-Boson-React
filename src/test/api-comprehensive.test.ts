import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../services/apiService'

describe('Complete API Service Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  // Mock data for different entities
  const mockBenefit = {
    id: 1,
    title: 'Test Benefit',
    description: 'Test Description',
    icon: '🚀',
    order: 1,
    active: true
  }

  const mockProcessStep = {
    id: 1,
    title: 'Test Step',
    description: 'Step Description',
    order: 1,
    icon: '📋'
  }

  const mockTestimonial = {
    id: 1,
    name: 'John Doe',
    company: 'Test Company',
    message: 'Great service!',
    rating: 5,
    image: 'profile.jpg'
  }

  const mockHeroSlide = {
    id: 1,
    title: 'Hero Title',
    subtitle: 'Hero Subtitle',
    image: 'hero.jpg',
    cta_text: 'Learn More',
    cta_link: '/about'
  }

  const mockTeamMember = {
    id: 1,
    name: 'Jane Smith',
    position: 'Developer',
    bio: 'Experienced developer',
    image: 'jane.jpg',
    linkedin: 'https://linkedin.com/in/jane'
  }

  const mockService = {
    id: 1,
    title: 'Test Service',
    description: 'Service Description',
    price_range: '$1000-$5000',
    duration: '2-4 weeks'
  }

  const mockPage = {
    id: 1,
    slug: 'test-page',
    title: 'Test Page',
    content: '<p>Test content</p>',
    meta_description: 'Test meta',
    published: true
  }

  // Helper function to create successful mock response
  const mockSuccessResponse = (data: any) => ({
    ok: true,
    json: () => Promise.resolve({ status: 'success', data })
  })

  // Helper function to create error mock response
  const mockErrorResponse = (status: number) => ({
    ok: false,
    status,
    statusText: `Error ${status}`
  })

  describe('Benefits API', () => {
    it('should get all benefits', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockBenefit]))
      globalThis.fetch = mockFetch

      const result = await apiService.getBenefits()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/benefits', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockBenefit])
    })

    it('should create a benefit', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockBenefit))
      globalThis.fetch = mockFetch

      const result = await apiService.createBenefit(mockBenefit)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/benefits', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockBenefit)
      })
      expect(result.status).toBe('success')
    })

    it('should update a benefit', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockBenefit))
      globalThis.fetch = mockFetch

      const result = await apiService.updateBenefit(1, mockBenefit)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/benefits/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockBenefit)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a benefit', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deleteBenefit(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/benefits/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Process Steps API', () => {
    it('should get all process steps', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockProcessStep]))
      globalThis.fetch = mockFetch

      const result = await apiService.getProcessSteps()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/process-steps', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockProcessStep])
    })

    it('should create a process step', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockProcessStep))
      globalThis.fetch = mockFetch

      const result = await apiService.createProcessStep(mockProcessStep)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/process-steps', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockProcessStep)
      })
      expect(result.status).toBe('success')
    })

    it('should update a process step', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockProcessStep))
      globalThis.fetch = mockFetch

      const result = await apiService.updateProcessStep(1, mockProcessStep)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/process-steps/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockProcessStep)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a process step', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deleteProcessStep(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/process-steps/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Testimonials API', () => {
    it('should get all testimonials', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockTestimonial]))
      globalThis.fetch = mockFetch

      const result = await apiService.getTestimonials()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/testimonials', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockTestimonial])
    })

    it('should create a testimonial', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockTestimonial))
      globalThis.fetch = mockFetch

      const result = await apiService.createTestimonial(mockTestimonial)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/testimonials', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockTestimonial)
      })
      expect(result.status).toBe('success')
    })

    it('should update a testimonial', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockTestimonial))
      globalThis.fetch = mockFetch

      const result = await apiService.updateTestimonial(1, mockTestimonial)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/testimonials/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockTestimonial)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a testimonial', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deleteTestimonial(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/testimonials/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Hero Slides API', () => {
    it('should get all hero slides', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockHeroSlide]))
      globalThis.fetch = mockFetch

      const result = await apiService.getHeroSlides()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/hero-slides', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockHeroSlide])
    })

    it('should create a hero slide', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockHeroSlide))
      globalThis.fetch = mockFetch

      const result = await apiService.createHeroSlide(mockHeroSlide)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/hero-slides', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockHeroSlide)
      })
      expect(result.status).toBe('success')
    })

    it('should update a hero slide', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockHeroSlide))
      globalThis.fetch = mockFetch

      const result = await apiService.updateHeroSlide(1, mockHeroSlide)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/hero-slides/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockHeroSlide)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a hero slide', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deleteHeroSlide(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/hero-slides/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Team Members API', () => {
    it('should get all team members', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockTeamMember]))
      globalThis.fetch = mockFetch

      const result = await apiService.getTeamMembers()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/team', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockTeamMember])
    })

    it('should create a team member', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockTeamMember))
      globalThis.fetch = mockFetch

      const result = await apiService.createTeamMember(mockTeamMember)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/team', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockTeamMember)
      })
      expect(result.status).toBe('success')
    })

    it('should update a team member', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockTeamMember))
      globalThis.fetch = mockFetch

      const result = await apiService.updateTeamMember(1, mockTeamMember)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/team/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockTeamMember)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a team member', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deleteTeamMember(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/team/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Services API', () => {
    it('should get all services', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockService]))
      globalThis.fetch = mockFetch

      const result = await apiService.getServices()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/services', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockService])
    })

    it('should create a service', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockService))
      globalThis.fetch = mockFetch

      const result = await apiService.createService(mockService)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/services', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockService)
      })
      expect(result.status).toBe('success')
    })

    it('should update a service', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockService))
      globalThis.fetch = mockFetch

      const result = await apiService.updateService(1, mockService)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/services/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockService)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a service', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deleteService(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/services/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Pages API', () => {
    it('should get all pages', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse([mockPage]))
      globalThis.fetch = mockFetch

      const result = await apiService.getPages()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual([mockPage])
    })

    it('should get page by slug', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockPage))
      globalThis.fetch = mockFetch

      const result = await apiService.getPageBySlug('test-page')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages/slug/test-page', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual(mockPage)
    })

    it('should handle special characters in slug', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockPage))
      globalThis.fetch = mockFetch

      const result = await apiService.getPageBySlug('test page with spaces')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages/slug/test%20page%20with%20spaces', expect.any(Object))
      expect(result.status).toBe('success')
    })

    it('should create a page', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockPage))
      globalThis.fetch = mockFetch

      const result = await apiService.createPage(mockPage)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(mockPage)
      })
      expect(result.status).toBe('success')
    })

    it('should update a page', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(mockPage))
      globalThis.fetch = mockFetch

      const result = await apiService.updatePage(1, mockPage)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(mockPage)
      })
      expect(result.status).toBe('success')
    })

    it('should delete a page', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({}))
      globalThis.fetch = mockFetch

      const result = await apiService.deletePage(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
      expect(result.status).toBe('success')
    })

    it('should increment page views', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse({ views: 1 }))
      globalThis.fetch = mockFetch

      const result = await apiService.incrementPageViews('test-page')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/pages/slug/test-page/views', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      })
      expect(result.status).toBe('success')
    })
  })

  describe('Health Check API', () => {
    it('should perform health check', async () => {
      const healthData = { status: 'healthy', message: 'API is running' }
      const mockFetch = vi.fn().mockResolvedValue(mockSuccessResponse(healthData))
      globalThis.fetch = mockFetch

      const result = await apiService.healthCheck()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/health', expect.any(Object))
      expect(result.status).toBe('success')
      expect(result.data).toEqual(healthData)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
      globalThis.fetch = mockFetch

      const result = await apiService.getBenefits()

      expect(result.status).toBe('error')
      expect(result.message).toBe('Network error')
    })

    it('should handle HTTP errors gracefully', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockErrorResponse(404))
      globalThis.fetch = mockFetch

      const result = await apiService.getBenefits()

      expect(result.status).toBe('error')
      expect(result.message).toContain('HTTP error! status: 404')
    })

    it('should handle server errors gracefully', async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockErrorResponse(500))
      globalThis.fetch = mockFetch

      const result = await apiService.getServices()

      expect(result.status).toBe('error')
      expect(result.message).toContain('HTTP error! status: 500')
    })
  })
});
