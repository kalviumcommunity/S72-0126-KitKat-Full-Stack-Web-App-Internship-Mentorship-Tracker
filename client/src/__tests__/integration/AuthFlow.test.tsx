import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/forms/LoginForm'
import { SignupForm } from '@/components/forms/SignupForm'

// Mock the auth context
const mockLogin = jest.fn()
const mockSignup = jest.fn()
const mockUser = {
  id: '1',
  email: 'test@example.com',
  role: 'STUDENT',
  firstName: 'John',
  lastName: 'Doe',
}

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
    signup: mockSignup,
    logout: jest.fn(),
    loading: false,
    error: null,
  }),
}))

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    mockLogin.mockClear()
    mockSignup.mockClear()
  })

  describe('Login Flow', () => {
    it('allows user to login successfully', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ success: true, user: mockUser })

      render(<LoginForm />)

      // Fill out login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      // Verify login was called
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('shows validation errors for invalid input', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      // Try to submit with invalid email
      await user.type(screen.getByLabelText(/email/i), 'invalid-email')
      await user.type(screen.getByLabelText(/password/i), '123') // Too short

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })

      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('handles login errors gracefully', async () => {
      const user = userEvent.setup()
      mockLogin.mockRejectedValue(new Error('Invalid credentials'))

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('shows loading state during login', async () => {
      const user = userEvent.setup()
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

      render(<LoginForm />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Signup Flow', () => {
    it('allows user to signup successfully', async () => {
      const user = userEvent.setup()
      mockSignup.mockResolvedValue({ success: true, user: mockUser })

      render(<SignupForm />)

      // Fill out signup form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      // Verify signup was called
      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          role: 'STUDENT',
        })
      })
    })

    it('validates password confirmation', async () => {
      const user = userEvent.setup()
      render(<SignupForm />)

      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPassword')
      await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
      })

      expect(mockSignup).not.toHaveBeenCalled()
    })

    it('validates password strength', async () => {
      const user = userEvent.setup()
      render(<SignupForm />)

      await user.type(screen.getByLabelText(/^password/i), 'weak')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument()
      })
    })

    it('handles signup errors gracefully', async () => {
      const user = userEvent.setup()
      mockSignup.mockRejectedValue(new Error('Email already exists'))

      render(<SignupForm />)

      // Fill out form with valid data
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'Password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123')
      await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation Between Auth Forms', () => {
    it('provides link from login to signup', () => {
      render(<LoginForm />)
      expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/auth/signup')
    })

    it('provides link from signup to login', () => {
      render(<SignupForm />)
      expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/auth/login')
    })
  })
})