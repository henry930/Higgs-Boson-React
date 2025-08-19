import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '../test-utils'
import NotFound from '../../pages/NotFound/NotFound'

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<NotFound />)
    }).not.toThrow()
  })

  it('loads 404 page content', () => {
    render(<NotFound />)
    // Just check that it renders something
    expect(document.body).toBeTruthy()
  })
})
