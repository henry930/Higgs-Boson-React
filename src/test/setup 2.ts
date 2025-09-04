import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock fetch for API tests
globalThis.fetch = vi.fn()

// Setup fetch mock reset before each test
beforeEach(() => {
  vi.resetAllMocks()
})
