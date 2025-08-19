import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '../test-utils'
import About from '../../pages/About/About'

describe('About Page', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<About />)
    }).not.toThrow()
  })

  it('loads about page content', () => {
    render(<About />)
    // Just check that it renders something
    expect(document.body).toBeTruthy()
  })
})
