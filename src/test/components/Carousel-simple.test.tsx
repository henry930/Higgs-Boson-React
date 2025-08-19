import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Carousel from '../../components/Carousel/Carousel';

describe('Carousel Component', () => {
  const mockItems = [
    { id: '1', content: <div>Slide 1</div> },
    { id: '2', content: <div>Slide 2</div> },
    { id: '3', content: <div>Slide 3</div> },
  ];

  it('renders correctly with items', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('returns null when no items provided', () => {
    const { container } = render(<Carousel items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows navigation arrows by default when multiple items', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('hides navigation arrows when showArrows is false', () => {
    render(<Carousel items={mockItems} showArrows={false} autoPlay={false} />);
    
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
  });

  it('shows dots navigation by default when multiple items', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    const dots = screen.getAllByRole('button', { name: /Go to slide/i });
    expect(dots).toHaveLength(3);
  });

  it('hides dots navigation when showDots is false', () => {
    render(<Carousel items={mockItems} showDots={false} autoPlay={false} />);
    
    const dots = screen.queryAllByRole('button', { name: /Go to slide/i });
    expect(dots).toHaveLength(0);
  });

  it('does not show navigation for single item', () => {
    const singleItem = [{ id: '1', content: <div>Single Slide</div> }];
    render(<Carousel items={singleItem} autoPlay={false} />);
    
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: /Go to slide/i })).toHaveLength(0);
  });

  it('navigates to next slide when next arrow is clicked', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    // Check if the carousel track has moved (transform style)
    const track = document.querySelector('[class*="carouselTrack"]');
    expect(track).toHaveStyle('transform: translateX(-100%)');
  });

  it('navigates to previous slide when previous arrow is clicked', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    const prevButton = screen.getByLabelText('Previous slide');
    fireEvent.click(prevButton);
    
    // Should go to last slide (index 2)
    const track = document.querySelector('[class*="carouselTrack"]');
    expect(track).toHaveStyle('transform: translateX(-200%)');
  });

  it('navigates to specific slide when dot is clicked', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    const secondDot = screen.getByLabelText('Go to slide 2');
    fireEvent.click(secondDot);
    
    const track = document.querySelector('[class*="carouselTrack"]');
    expect(track).toHaveStyle('transform: translateX(-100%)');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Carousel items={mockItems} className="custom-carousel" autoPlay={false} />
    );
    
    expect(container.firstChild).toHaveClass('custom-carousel');
  });

  it('cycles correctly with next button from last to first slide', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    const nextButton = screen.getByLabelText('Next slide');
    
    // Go to last slide
    fireEvent.click(nextButton); // slide 2
    fireEvent.click(nextButton); // slide 3
    fireEvent.click(nextButton); // should cycle back to slide 1
    
    const track = document.querySelector('[class*="carouselTrack"]');
    expect(track).toHaveStyle('transform: translateX(-0%)');
  });

  it('cycles correctly with previous button from first to last slide', () => {
    render(<Carousel items={mockItems} autoPlay={false} />);
    
    const prevButton = screen.getByLabelText('Previous slide');
    fireEvent.click(prevButton); // Should go to last slide
    
    const track = document.querySelector('[class*="carouselTrack"]');
    expect(track).toHaveStyle('transform: translateX(-200%)');
  });
});
