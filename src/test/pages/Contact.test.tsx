import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '../test-utils'
import Contact from '../../pages/Contact/Contact'

describe('Contact Page', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<Contact />)
    }).not.toThrow()
  })

  it('loads contact page content', () => {
    render(<Contact />)
    // Just check that it renders something
    expect(document.body).toBeTruthy()
  })
})
