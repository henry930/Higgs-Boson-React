import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BenefitCard from '../../components/BenefitCard/BenefitCard'

describe('BenefitCard Component', () => {
  const mockProps = {
    icon: '🚀',
    title: 'Test Benefit',
    description: 'This is a test benefit description'
  }

  it('renders without crashing', () => {
    expect(() => {
      render(<BenefitCard {...mockProps} />)
    }).not.toThrow()
  })

  it('displays the provided icon', () => {
    render(<BenefitCard {...mockProps} />)
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('displays the provided title', () => {
    render(<BenefitCard {...mockProps} />)
    expect(screen.getByText('Test Benefit')).toBeInTheDocument()
  })

  it('displays the provided description', () => {
    render(<BenefitCard {...mockProps} />)
    expect(screen.getByText('This is a test benefit description')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(<BenefitCard {...mockProps} className="custom-class" />)
    const cardElement = container.firstChild
    expect(cardElement).toHaveClass('custom-class')
  })

  it('has proper heading structure', () => {
    render(<BenefitCard {...mockProps} />)
    const titleElement = screen.getByRole('heading', { level: 3 })
    expect(titleElement).toHaveTextContent('Test Benefit')
  })
})
