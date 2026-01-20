import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/forms/LoginForm'
import { SignupForm } from '@/components/forms/SignupForm'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { checkAccessibility } from '@/__tests__/utils/test-utils'

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('Form Accessibility', () => {
  describe('LoginForm', () => {
    it('has proper form structure and labels', () => {
      renderWithAuth(<LoginForm />)
      
      // Check form has proper role
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      
      // Check all inputs have labels
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      
      const passwordInput = screen.getByLabelText(/password/i)
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('required')
      
      // Check submit button
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('has proper ARIA attributes', () => {
      renderWithAuth(<LoginForm />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('noValidate') // Client-side validation
      
      // Check for proper labeling
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveAttribute('aria-required', 'true')
      
      const passwordInput = screen.getByLabelText(/password/i)
      expect(passwordInput).toHaveAttribute('aria-required', 'true')
    })

    it('shows validation errors with proper ARIA attributes', async () => {
      renderWithAuth(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i)
        expect(emailInput).toHaveAttribute('aria-invalid', 'true')
        expect(emailInput).toHaveAttribute('aria-describedby')
        
        const errorMessage = screen.getByText(/email is required/i)
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })

    it('passes basic accessibility checks', async () => {
      const { container } = renderWithAuth(<LoginForm />)
      await checkAccessibility(container)
    })
  })

  describe('SignupForm', () => {
    it('has proper form structure and labels', () => {
      renderWithAuth(<SignupForm />)
      
      // Check all required fields have labels
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
    })

    it('has proper fieldset for related fields', () => {
      renderWithAuth(<SignupForm />)
      
      // Password fields should be grouped
      const passwordFieldset = screen.getByRole('group', { name: /password/i })
      expect(passwordFieldset).toBeInTheDocument()
    })

    it('has proper select accessibility', () => {
      renderWithAuth(<SignupForm />)
      
      const roleSelect = screen.getByLabelText(/role/i)
      expect(roleSelect).toHaveAttribute('required')
      expect(roleSelect).toHaveAttribute('aria-required', 'true')
      
      // Check options are properly labeled
      const studentOption = screen.getByRole('option', { name: /student/i })
      expect(studentOption).toBeInTheDocument()
      
      const mentorOption = screen.getByRole('option', { name: /mentor/i })
      expect(mentorOption).toBeInTheDocument()
    })

    it('shows password strength indicator with proper ARIA', () => {
      renderWithAuth(<SignupForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      fireEvent.change(passwordInput, { target: { value: 'weak' } })
      
      const strengthIndicator = screen.getByRole('status')
      expect(strengthIndicator).toHaveAttribute('aria-live', 'polite')
    })

    it('passes basic accessibility checks', async () => {
      const { container } = renderWithAuth(<SignupForm />)
      await checkAccessibility(container)
    })
  })

  describe('ApplicationForm', () => {
    it('has proper form structure', () => {
      render(<ApplicationForm />)
      
      // Check required fields have proper labels
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/platform/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    })

    it('has proper date input accessibility', () => {
      render(<ApplicationForm />)
      
      const deadlineInput = screen.getByLabelText(/deadline/i)
      expect(deadlineInput).toHaveAttribute('type', 'date')
      
      const appliedDateInput = screen.getByLabelText(/applied date/i)
      expect(appliedDateInput).toHaveAttribute('type', 'date')
    })

    it('has proper textarea accessibility', () => {
      render(<ApplicationForm />)
      
      const notesTextarea = screen.getByLabelText(/notes/i)
      expect(notesTextarea).toHaveAttribute('rows')
      expect(notesTextarea).toHaveAttribute('placeholder')
    })

    it('passes basic accessibility checks', async () => {
      const { container } = render(<ApplicationForm />)
      await checkAccessibility(container)
    })
  })

  describe('Form Error Handling', () => {
    it('announces errors to screen readers', async () => {
      renderWithAuth(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert')
        expect(errorMessages.length).toBeGreaterThan(0)
        
        errorMessages.forEach(error => {
          expect(error).toHaveAttribute('aria-live', 'assertive')
        })
      })
    })

    it('focuses first error field on validation failure', async () => {
      renderWithAuth(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i)
        expect(emailInput).toHaveFocus()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports tab navigation', () => {
      renderWithAuth(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      // Check tab order
      emailInput.focus()
      expect(emailInput).toHaveFocus()
      
      fireEvent.keyDown(emailInput, { key: 'Tab' })
      expect(passwordInput).toHaveFocus()
      
      fireEvent.keyDown(passwordInput, { key: 'Tab' })
      expect(submitButton).toHaveFocus()
    })

    it('supports Enter key submission', () => {
      const mockSubmit = jest.fn()
      renderWithAuth(<LoginForm onSubmit={mockSubmit} />)
      
      const form = screen.getByRole('form')
      fireEvent.keyDown(form, { key: 'Enter' })
      
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  describe('Screen Reader Support', () => {
    it('has proper heading structure', () => {
      renderWithAuth(<LoginForm />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent(/sign in/i)
    })

    it('has proper form instructions', () => {
      renderWithAuth(<SignupForm />)
      
      const instructions = screen.getByText(/create your account/i)
      expect(instructions).toBeInTheDocument()
    })

    it('announces loading states', () => {
      renderWithAuth(<LoginForm />)
      
      // Mock loading state
      const loadingButton = screen.getByRole('button', { name: /signing in/i })
      expect(loadingButton).toHaveAttribute('aria-disabled', 'true')
      expect(loadingButton).toHaveAttribute('aria-describedby')
    })
  })
})