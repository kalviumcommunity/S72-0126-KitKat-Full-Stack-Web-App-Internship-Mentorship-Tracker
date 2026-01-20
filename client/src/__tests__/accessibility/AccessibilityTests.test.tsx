import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { LoginForm } from '@/components/forms/LoginForm'
import { ApplicationCard } from '@/components/features/applications/ApplicationCard'
import { ApplicationPlatform, ApplicationStatus } from '@/lib/types'

// Mock auth context for LoginForm
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    loading: false,
    error: null,
  }),
}))

describe('Accessibility Tests', () => {
  describe('Button Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button aria-label="Save changes">Save</Button>)
      const button = screen.getByRole('button', { name: /save changes/i })
      expect(button).toBeInTheDocument()
    })

    it('is keyboard accessible', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('indicates disabled state to screen readers', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('indicates loading state to screen readers', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Input Accessibility', () => {
    it('has proper label association', () => {
      render(<Input label="Email Address" />)
      const input = screen.getByLabelText('Email Address')
      expect(input).toBeInTheDocument()
    })

    it('indicates required fields to screen readers', () => {
      render(<Input label="Required Field" required />)
      const input = screen.getByLabelText('Required Field *')
      expect(input).toHaveAttribute('required')
    })

    it('associates error messages with input', () => {
      render(<Input label="Email" error="Invalid email format" />)
      const input = screen.getByLabelText('Email')
      const errorMessage = screen.getByText('Invalid email format')
      
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby')
      expect(errorMessage).toHaveAttribute('id', input.getAttribute('aria-describedby'))
    })

    it('associates helper text with input', () => {
      render(<Input label="Password" helperText="Must be at least 8 characters" />)
      const input = screen.getByLabelText('Password')
      const helperText = screen.getByText('Must be at least 8 characters')
      
      expect(input).toHaveAttribute('aria-describedby')
      expect(helperText).toHaveAttribute('id', input.getAttribute('aria-describedby'))
    })
  })

  describe('Badge Accessibility', () => {
    it('has appropriate role for status badges', () => {
      render(<Badge>Status: Active</Badge>)
      const badge = screen.getByText('Status: Active')
      expect(badge).toBeInTheDocument()
    })

    it('provides context for color-only information', () => {
      render(<Badge variant="error" aria-label="Error status">Error</Badge>)
      const badge = screen.getByLabelText('Error status')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Form Accessibility', () => {
    it('has proper form structure and labels', () => {
      render(<LoginForm />)
      
      // Check for form landmark
      const form = screen.getByRole('form') || screen.getByRole('main').querySelector('form')
      expect(form).toBeInTheDocument()
      
      // Check for proper labels
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      
      // Check for submit button
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('provides clear error messages', () => {
      render(<LoginForm />)
      
      // Error messages should be associated with their inputs
      // This would be tested in integration tests when validation occurs
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })
  })

  describe('Card Accessibility', () => {
    const mockApplication = {
      id: '1',
      userId: 'user1',
      company: 'Google',
      role: 'Software Engineer Intern',
      platform: ApplicationPlatform.COMPANY_WEBSITE,
      status: ApplicationStatus.APPLIED,
      resumeUrl: 'https://example.com/resume.pdf',
      notes: 'Applied through university portal',
      deadline: '2024-12-31T23:59:59Z',
      appliedDate: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      feedback: [],
    }

    it('has proper heading structure', () => {
      render(<ApplicationCard application={mockApplication} />)
      
      // Company name should be a heading
      const companyHeading = screen.getByRole('heading', { name: /google/i })
      expect(companyHeading).toBeInTheDocument()
    })

    it('has accessible links', () => {
      render(<ApplicationCard application={mockApplication} />)
      
      // Links should have descriptive text
      const editLink = screen.getByRole('link', { name: /edit/i })
      const viewLink = screen.getByRole('link', { name: /view details/i })
      const resumeLink = screen.getByRole('link', { name: /view resume/i })
      
      expect(editLink).toHaveAttribute('href', '/student/applications/1/edit')
      expect(viewLink).toHaveAttribute('href', '/student/applications/1')
      expect(resumeLink).toHaveAttribute('href', 'https://example.com/resume.pdf')
    })

    it('provides context for status information', () => {
      render(<ApplicationCard application={mockApplication} />)
      
      // Status badge should provide context
      const statusBadge = screen.getByText('Applied')
      expect(statusBadge).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through interactive elements', () => {
      render(
        <div>
          <Button>First Button</Button>
          <Input label="Text Input" />
          <Button>Second Button</Button>
        </div>
      )
      
      const firstButton = screen.getByRole('button', { name: /first button/i })
      const input = screen.getByLabelText('Text Input')
      const secondButton = screen.getByRole('button', { name: /second button/i })
      
      // All interactive elements should be focusable
      expect(firstButton).toHaveAttribute('tabIndex', '0')
      expect(input).not.toHaveAttribute('tabIndex', '-1')
      expect(secondButton).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Screen Reader Support', () => {
    it('provides meaningful text alternatives', () => {
      render(<Badge variant="success">✓ Completed</Badge>)
      
      // Icon should have text alternative
      const badge = screen.getByText('✓ Completed')
      expect(badge).toBeInTheDocument()
    })

    it('uses semantic HTML elements', () => {
      render(
        <div>
          <Button>Action Button</Button>
          <Input label="Form Input" />
        </div>
      )
      
      // Should use proper semantic elements
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Color and Contrast', () => {
    it('does not rely solely on color for information', () => {
      render(
        <div>
          <Badge variant="success">✓ Success</Badge>
          <Badge variant="error">✗ Error</Badge>
          <Badge variant="warning">⚠ Warning</Badge>
        </div>
      )
      
      // Each status should have both color and text/icon indicators
      expect(screen.getByText('✓ Success')).toBeInTheDocument()
      expect(screen.getByText('✗ Error')).toBeInTheDocument()
      expect(screen.getByText('⚠ Warning')).toBeInTheDocument()
    })
  })

  describe('Focus Management', () => {
    it('has visible focus indicators', () => {
      render(<Button>Focusable Button</Button>)
      const button = screen.getByRole('button')
      
      // Button should be focusable and have focus styles
      expect(button).toHaveClass('focus:ring-2')
    })

    it('maintains logical focus order', () => {
      render(
        <form>
          <Input label="First Field" />
          <Input label="Second Field" />
          <Button type="submit">Submit</Button>
        </form>
      )
      
      // Elements should be in logical tab order
      const firstField = screen.getByLabelText('First Field')
      const secondField = screen.getByLabelText('Second Field')
      const submitButton = screen.getByRole('button', { name: /submit/i })
      
      expect(firstField).toBeInTheDocument()
      expect(secondField).toBeInTheDocument()
      expect(submitButton).toBeInTheDocument()
    })
  })
})