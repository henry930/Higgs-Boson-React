import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ContactForm from '../../components/ContactForm/ContactForm';

describe('ContactForm Component', () => {
  it('renders all form fields correctly', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project timeline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('displays form title', () => {
    render(<ContactForm />);
    expect(screen.getByText('Start Your Project')).toBeInTheDocument();
  });

  it('marks required fields with asterisk', () => {
    render(<ContactForm />);
    
    expect(screen.getByText('Full Name *')).toBeInTheDocument();
    expect(screen.getByText('Email Address *')).toBeInTheDocument();
    expect(screen.getByText('Project Description *')).toBeInTheDocument();
  });

  it('updates form data when user types in fields', async () => {
    render(<ContactForm />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const companyInput = screen.getByLabelText(/company/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const messageInput = screen.getByLabelText(/project description/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(companyInput, { target: { value: 'Acme Corp' } });
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });
    fireEvent.change(messageInput, { target: { value: 'Test project description' } });
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(companyInput).toHaveValue('Acme Corp');
    expect(phoneInput).toHaveValue('555-1234');
    expect(messageInput).toHaveValue('Test project description');
  });

  it('updates select fields correctly', async () => {
    render(<ContactForm />);
    
    const budgetSelect = screen.getByLabelText(/project budget/i);
    const timelineSelect = screen.getByLabelText(/project timeline/i);
    
    fireEvent.change(budgetSelect, { target: { value: '25k-50k' } });
    fireEvent.change(timelineSelect, { target: { value: '3-6months' } });
    
    expect(budgetSelect).toHaveValue('25k-50k');
    expect(timelineSelect).toHaveValue('3-6months');
  });

  it('displays all budget options', () => {
    render(<ContactForm />);
    
    const budgetSelect = screen.getByLabelText(/project budget/i);
    
    expect(budgetSelect).toContainHTML('<option value="">Select budget range</option>');
    expect(budgetSelect).toContainHTML('<option value="10k-25k">$10k - $25k</option>');
    expect(budgetSelect).toContainHTML('<option value="25k-50k">$25k - $50k</option>');
    expect(budgetSelect).toContainHTML('<option value="50k-100k">$50k - $100k</option>');
    expect(budgetSelect).toContainHTML('<option value="100k+">$100k+</option>');
  });

  it('displays all timeline options', () => {
    render(<ContactForm />);
    
    const timelineSelect = screen.getByLabelText(/project timeline/i);
    
    expect(timelineSelect).toContainHTML('<option value="">Select timeline</option>');
    expect(timelineSelect).toContainHTML('<option value="asap">ASAP</option>');
    expect(timelineSelect).toContainHTML('<option value="1-3months">1-3 months</option>');
    expect(timelineSelect).toContainHTML('<option value="3-6months">3-6 months</option>');
    expect(timelineSelect).toContainHTML('<option value="6months+">6+ months</option>');
  });

  it('calls onSubmit callback when form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/project description/i), { 
      target: { value: 'Test project' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: '',
        phone: '',
        message: 'Test project',
        budget: '',
        timeline: ''
      });
    });
  });

  it('prevents form submission when required fields are empty', () => {
    const mockOnSubmit = vi.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits complete form data with all fields filled', async () => {
    const mockOnSubmit = vi.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Fill all fields
    fireEvent.change(screen.getByLabelText(/full name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/company/i), { 
      target: { value: 'Acme Corp' } 
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), { 
      target: { value: '555-1234' } 
    });
    fireEvent.change(screen.getByLabelText(/project budget/i), { 
      target: { value: '25k-50k' } 
    });
    fireEvent.change(screen.getByLabelText(/project timeline/i), { 
      target: { value: '3-6months' } 
    });
    fireEvent.change(screen.getByLabelText(/project description/i), { 
      target: { value: 'Test project description' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '555-1234',
        message: 'Test project description',
        budget: '25k-50k',
        timeline: '3-6months'
      });
    });
  });

  it('applies custom className', () => {
    const { container } = render(<ContactForm className="custom-form" />);
    
    const form = container.querySelector('[class*="contactForm"]');
    expect(form).toHaveClass('custom-form');
  });

  it('has correct input types for different fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/company/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/phone number/i)).toHaveAttribute('type', 'tel');
  });

  it('has placeholder text for message field', () => {
    render(<ContactForm />);
    
    const messageInput = screen.getByLabelText(/project description/i);
    expect(messageInput).toHaveAttribute('placeholder', 'Tell us about your project, goals, and requirements...');
  });

  it('logs form data to console when no onSubmit callback is provided', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ContactForm />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/project description/i), { 
      target: { value: 'Test project' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', expect.any(Object));
    });
    
    consoleSpy.mockRestore();
  });
});
