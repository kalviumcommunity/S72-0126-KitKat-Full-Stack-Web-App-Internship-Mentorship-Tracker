import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/components/forms/SignupForm'
import { AuthContext } from '@/contexts/AuthContext'
import { mockUnauthenticatedContextValue } from '@/__tests__/utils/test-utils'

const mockSignup = jest.fn()
const mockAuthContext = {
  ...mockUnauthenticatedContextValue,
  signup: mockSignup,
}

const renderSignupForm = () => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <SignupForm />
    </AuthContext.Provider>
  )
}

describe('SignupForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders signup form fields', () => {
    renderSignupForm()
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderSignupForm()
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderSignupForm()
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it('validates password strength', async () => {
    const user = userEvent.setup()
    renderSignupForm()
    
    const passwordInput = screen.getByLabelText(/^password/i)
    await user.type(passwordInput, 'weak')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    const user = userEvent.setup()
    renderSignupForm()
    
    const passwordInput = screen.getByLabelText(/^password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockSignup.mockResolvedValue({ success: true })
    
    renderSignupForm()
    
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'STUDENT',
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockSignup.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderSignupForm()
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
  })

  it('handles signup errors', async () => {
    const user = userEvent.setup()
    mockSignup.mockResolvedValue({ 
      success: false, 
      error: 'Email already exists' 
    })
    
    renderSignupForm()
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })

  it('shows password strength indicator', async () => {
    const user = userEvent.setup()
    renderSignupForm()
    
    const passwordInput = screen.getByLabelText(/^password/i)
    await user.type(passwordInput, 'weak')
    
    // Should show weak password indicator
    expect(screen.getByText(/weak/i)).toBeInTheDocument()
    
    await user.clear(passwordInput)
    await user.type(passwordInput, 'StrongPassword123!')
    
    // Should show strong password indicator
    expect(screen.getByText(/strong/i)).toBeInTheDocument()
  })
})