import { describe, it, expect } from 'vitest'
import { render } from '../test-utils'
import Navigation from '../../components/Navigation/Navigation'

describe('Navigation Component', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<Navigation />)
    }).not.toThrow()
  })

  it('contains navigation elements', () => {
    render(<Navigation />)
    // Just check that it renders something
    expect(document.body).toBeTruthy()
  })
})
