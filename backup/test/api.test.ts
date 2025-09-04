import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../services/apiService'
import { API_CONFIG } from '../config/api'

describe('API Service Tests', () => {
  const mockSuccessResponse = {
    status: 'success',
    message: 'Success',
    data: [
      {
        id: 1,
        title: 'Test Service',
        description: 'Test Description',
        short_description: 'Test Short Description',
        icon: '🚀',
        features: ['Feature 1', 'Feature 2'],
        price_range: '$1,000 - $10,000',
        duration: '1-2 weeks',
        category: 'Test Category',
        order: 1,
        featured: true,
        active: true,
        created_at: '2025-08-19T10:00:00Z',
        updated_at: '2025-08-19T10:00:00Z'
      }
    ]
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getServices', () => {
    it('should fetch services successfully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
      globalThis.fetch = mockFetch

      const result = await apiService.getServices()

      expect(mockFetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/api/services`, expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      }))
      expect(result.status).toBe('success')
      expect(result.data).toEqual(mockSuccessResponse.data)
    })

    it('should handle API errors gracefully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
      globalThis.fetch = mockFetch

      const result = await apiService.getServices()
      
      expect(result.status).toBe('error')
      expect(result.message).toContain('HTTP error! status: 500')
    })

    it('should handle network errors', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
      globalThis.fetch = mockFetch

      const result = await apiService.getServices()
      
      expect(result.status).toBe('error')
      expect(result.message).toBe('Network error')
    })
  })

  describe('createService', () => {
    it('should create a new service', async () => {
      const newService = {
        title: 'New Service',
        description: 'New Description',
        short_description: 'New Short Description',
        icon: '🆕',
        features: ['New Feature'],
        price_range: '$5,000 - $15,000',
        duration: '2-3 weeks',
        category: 'New Category',
        order: 2,
        featured: false,
        active: true
      }

      const mockCreatedService = { ...newService, id: 2, created_at: '2025-08-19T11:00:00Z', updated_at: '2025-08-19T11:00:00Z' }
      
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          status: 'success',
          data: mockCreatedService
        })
      })
      globalThis.fetch = mockFetch

      const result = await apiService.createService(newService)

      expect(mockFetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/api/services`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(newService)
      })
      expect(result.status).toBe('success')
      expect(result.data).toEqual(mockCreatedService)
    })
  })
})
