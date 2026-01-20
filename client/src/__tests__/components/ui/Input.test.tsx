import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByText(/email/i)).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input label="Test" onChange={handleChange} />)
    
    const input = screen.getByLabelText(/test/i)
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error state', () => {
    render(<Input label="Test" error="This field is required" />)
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/test/i)).toHaveClass('border-red-500')
  })

  it('shows success state', () => {
    render(<Input label="Test" success />)
    expect(screen.getByLabelText(/test/i)).toHaveClass('border-green-500')
  })

  it('can be disabled', () => {
    render(<Input label="Test" disabled />)
    expect(screen.getByLabelText(/test/i)).toBeDisabled()
  })

  it('supports different types', () => {
    const { rerender } = render(<Input label="Password" type="password" />)
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')

    rerender(<Input label="Email" type="email" />)
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
  })

  it('shows required indicator', () => {
    render(<Input label="Required Field" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('supports placeholder text', () => {
    render(<Input label="Test" placeholder="Enter text here" />)
    expect(screen.getByPlaceholderText(/enter text here/i)).toBeInTheDocument()
  })

  it('shows helper text', () => {
    render(<Input label="Test" helperText="This is helper text" />)
    expect(screen.getByText(/this is helper text/i)).toBeInTheDocument()
  })

  it('supports icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>
    render(<Input label="Test" icon={<TestIcon />} />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })
})