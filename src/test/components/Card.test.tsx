import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Card from '../../components/UI/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default classes and props', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card');
    expect(card.className).toContain('padding-lg');
    expect(card.className).toContain('shadow-md');
  });

  it('applies custom padding and shadow classes', () => {
    const { container } = render(
      <Card padding="xl" shadow="lg">
        <p>Test content</p>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('padding-xl');
    expect(card.className).toContain('shadow-lg');
  });

  it('applies hover class when hover prop is true', () => {
    const { container } = render(
      <Card hover>
        <p>Test content</p>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Test content</p>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('handles click events when onClick is provided', () => {
    const handleClick = vi.fn();
    
    const { container } = render(
      <Card onClick={handleClick}>
        <p>Test content</p>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when not provided', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    // Should not throw an error when clicked
    expect(() => fireEvent.click(card)).not.toThrow();
  });

  it('applies all padding sizes correctly', () => {
    const paddings = ['sm', 'md', 'lg', 'xl'] as const;
    
    paddings.forEach(padding => {
      const { container, unmount } = render(
        <Card padding={padding}>
          <p>Test content</p>
        </Card>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain(`padding-${padding}`);
      unmount();
    });
  });

  it('applies all shadow sizes correctly', () => {
    const shadows = ['sm', 'md', 'lg', 'xl'] as const;
    
    shadows.forEach(shadow => {
      const { container, unmount } = render(
        <Card shadow={shadow}>
          <p>Test content</p>
        </Card>
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain(`shadow-${shadow}`);
      unmount();
    });
  });
});
