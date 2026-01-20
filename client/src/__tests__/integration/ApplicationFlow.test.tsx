import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { ApplicationCard } from '@/components/features/applications/ApplicationCard'
import { ApplicationPlatform, ApplicationStatus } from '@/lib/types'

// Mock API calls
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/lib/api', () => ({
  applications: {
    create: mockCreate,
    update: mockUpdate,
  },
}))

describe('Application Flow Integration Tests', () => {
  beforeEach(() => {
    mockCreate.mockClear()
    mockUpdate.mockClear()
  })

  describe('Create Application Flow', () => {
    it('allows user to create a new application end-to-end', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = jest.fn()
      
      mockCreate.mockResolvedValue({
        success: true,
        data: {
          id: '1',
          company: 'Google',
          role: 'Software Engineer Intern',
          platform: ApplicationPlatform.COMPANY_WEBSITE,
          status: ApplicationStatus.DRAFT,
        },
      })

      render(<ApplicationForm mode="create" onSuccess={mockOnSuccess} />)

      // Fill out the form
      await user.type(screen.getByLabelText(/company/i), 'Google')
      await user.type(screen.getByLabelText(/role/i), 'Software Engineer Intern')
      await user.selectOptions(screen.getByLabelText(/platform/i), 'COMPANY_WEBSITE')
      await user.selectOptions(screen.getByLabelText(/status/i), 'DRAFT')
      await user.type(screen.getByLabelText(/notes/i), 'Applying through university career portal')
      
      // Set deadline
      const deadlineInput = screen.getByLabelText(/deadline/i)
      await user.type(deadlineInput, '2024-12-31T23:59')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create application/i })
      await user.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
          company: 'Google',
          role: 'Software Engineer Intern',
          platform: 'COMPANY_WEBSITE',
          status: 'DRAFT',
          notes: 'Applying through university career portal',
        }))
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('handles validation errors gracefully', async () => {
      const user = userEvent.setup()
      render(<ApplicationForm mode="create" />)

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /create application/i })
      await user.click(submitButton)

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/role is required/i)).toBeInTheDocument()
      })

      // API should not be called
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('handles API errors gracefully', async () => {
      const user = userEvent.setup()
      mockCreate.mockRejectedValue(new Error('Network error'))

      render(<ApplicationForm mode="create" />)

      // Fill out minimum required fields
      await user.type(screen.getByLabelText(/company/i), 'Google')
      await user.type(screen.getByLabelText(/role/i), 'Software Engineer')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create application/i })
      await user.click(submitButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Edit Application Flow', () => {
    const initialData = {
      id: '1',
      company: 'Google',
      role: 'Software Engineer Intern',
      platform: ApplicationPlatform.COMPANY_WEBSITE,
      status: ApplicationStatus.DRAFT,
      notes: 'Initial notes',
      deadline: '2024-12-31',
    }

    it('allows user to edit existing application', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = jest.fn()
      
      mockUpdate.mockResolvedValue({
        success: true,
        data: { ...initialData, status: ApplicationStatus.APPLIED },
      })

      render(<ApplicationForm mode="edit" initialData={initialData} onSuccess={mockOnSuccess} />)

      // Verify initial data is loaded
      expect(screen.getByDisplayValue('Google')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Software Engineer Intern')).toBeInTheDocument()

      // Update the status
      await user.selectOptions(screen.getByLabelText(/status/i), 'APPLIED')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /update application/i })
      await user.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
          status: 'APPLIED',
        }))
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })
  })

  describe('Application Display', () => {
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

    it('displays application information correctly', () => {
      render(<ApplicationCard application={mockApplication} />)

      expect(screen.getByText('Google')).toBeInTheDocument()
      expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument()
      expect(screen.getByText('Applied')).toBeInTheDocument()
      expect(screen.getByText('Company Website')).toBeInTheDocument()
      expect(screen.getByText('Applied through university portal')).toBeInTheDocument()
    })

    it('provides navigation to edit and view pages', () => {
      render(<ApplicationCard application={mockApplication} />)

      expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute(
        'href',
        '/student/applications/1/edit'
      )
      expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
        'href',
        '/student/applications/1'
      )
    })
  })
})