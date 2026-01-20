import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Test Input" />)
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input label="Test" onChange={handleChange} />)
    
    const input = screen.getByLabelText('Test')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error message when error prop is provided', () => {
    render(<Input label="Test" error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByLabelText('Test')).toHaveClass('border-red-400')
  })

  it('shows helper text when provided', () => {
    render(<Input label="Test" helperText="This is helper text" />)
    expect(screen.getByText('This is helper text')).toBeInTheDocument()
  })

  it('applies required styling when required', () => {
    render(<Input label="Test" required />)
    expect(screen.getByText('Test *')).toBeInTheDocument()
  })

  it('disables input when disabled prop is true', () => {
    render(<Input label="Test" disabled />)
    expect(screen.getByLabelText('Test')).toBeDisabled()
  })

  it('applies different input types correctly', () => {
    const { rerender } = render(<Input label="Email" type="email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input label="Password" type="password" />)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')

    rerender(<Input label="Date" type="date" />)
    expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date')
  })

  it('shows placeholder text', () => {
    render(<Input label="Test" placeholder="Enter text here" />)
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument()
  })
})