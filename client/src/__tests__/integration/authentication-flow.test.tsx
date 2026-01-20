import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/forms/LoginForm'
import { SignupForm } from '@/components/forms/SignupForm'

// Mock the API
jest.mock('@/lib/api', () => ({
  auth: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    me: jest.fn(),
  },
}))

const mockApi = require('@/lib/api').auth

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
  })

  describe('Login Flow', () => {
    it('completes successful login flow', async () => {
      const user = userEvent.setup()
      
      mockApi.login.mockResolvedValue({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'STUDENT',
            firstName: 'Test',
            lastName: 'User',
          },
          token: 'mock-jwt-token',
        },
      })
      
      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      )
      
      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      // Verify API was called
      await waitFor(() => {
        expect(mockApi.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('handles login errors', async () => {
      const user = userEvent.setup()
      
      mockApi.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      })
      
      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      )
      
      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('shows loading state during login', async () => {
      const user = userEvent.setup()
      
      mockApi.login.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      )
      
      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      )
      
      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      // Verify loading state
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    })
  })

  describe('Signup Flow', () => {
    it('completes successful signup flow', async () => {
      const user = userEvent.setup()
      
      mockApi.signup.mockResolvedValue({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'newuser@example.com',
            role: 'STUDENT',
            firstName: 'New',
            lastName: 'User',
          },
          token: 'mock-jwt-token',
        },
      })
      
      render(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      )
      
      // Fill signup form
      await user.type(screen.getByLabelText(/first name/i), 'New')
      await user.type(screen.getByLabelText(/last name/i), 'User')
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.selectOptions(screen.getByLabelText(/role/i), 'STUDENT')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Verify API was called
      await waitFor(() => {
        expect(mockApi.signup).toHaveBeenCalledWith({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'STUDENT',
        })
      })
    })

    it('handles signup validation errors', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      )
      
      // Submit form without filling required fields
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Verify validation errors are shown
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('validates password confirmation', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      )
      
      // Fill form with mismatched passwords
      await user.type(screen.getByLabelText(/first name/i), 'Test')
      await user.type(screen.getByLabelText(/last name/i), 'User')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'different123')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      // Verify password mismatch error
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })
  })

  describe('Authentication State Management', () => {
    it('persists authentication state', async () => {
      mockApi.me.mockResolvedValue({
        success: true,
        data: {
          id: '1',
          email: 'test@example.com',
          role: 'STUDENT',
          firstName: 'Test',
          lastName: 'User',
        },
      })
      
      // Mock token in localStorage
      localStorage.setItem('auth-token', 'mock-jwt-token')
      
      const TestComponent = () => {
        const { user, isAuthenticated, isLoading } = useAuth()
        
        if (isLoading) return <div>Loading...</div>
        if (!isAuthenticated) return <div>Not authenticated</div>
        
        return <div>Welcome {user?.firstName}</div>
      }
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should show loading initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      
      // Should authenticate and show user
      await waitFor(() => {
        expect(screen.getByText(/welcome test/i)).toBeInTheDocument()
      })
    })

    it('handles token refresh', async () => {
      mockApi.me.mockResolvedValue({
        success: true,
        data: {
          id: '1',
          email: 'test@example.com',
          role: 'STUDENT',
          firstName: 'Test',
          lastName: 'User',
        },
      })
      
      const TestComponent = () => {
        const { refreshUser } = useAuth()
        
        return (
          <button onClick={refreshUser}>
            Refresh User
          </button>
        )
      }
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const refreshButton = screen.getByRole('button', { name: /refresh user/i })
      await userEvent.click(refreshButton)
      
      await waitFor(() => {
        expect(mockApi.me).toHaveBeenCalled()
      })
    })
  })
})