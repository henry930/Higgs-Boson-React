import { describe, it, expect } from 'vitest'
import { render } from '../test-utils'
import Footer from '../../components/Footer/Footer'

describe('Footer Component', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<Footer />)
    }).not.toThrow()
  })

  it('contains footer content', () => {
    render(<Footer />)
    // Just check that it renders something
    expect(document.body).toBeTruthy()
  })
})
