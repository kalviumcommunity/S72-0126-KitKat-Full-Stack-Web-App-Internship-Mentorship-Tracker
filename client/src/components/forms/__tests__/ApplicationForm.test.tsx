import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationForm } from '../ApplicationForm'
import { ApplicationPlatform, ApplicationStatus } from '@/lib/types'

// Mock the API
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/lib/api', () => ({
  applications: {
    create: mockCreate,
    update: mockUpdate,
  },
}))

describe('ApplicationForm Component', () => {
  beforeEach(() => {
    mockCreate.mockClear()
    mockUpdate.mockClear()
  })

  it('renders form in create mode', () => {
    render(<ApplicationForm mode="create" />)
    
    expect(screen.getByText(/create internship application/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/platform/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
  })

  it('renders form in edit mode with initial data', () => {
    const initialData = {
      id: '1',
      company: 'Google',
      role: 'Software Engineer',
      platform: ApplicationPlatform.COMPANY_WEBSITE,
      status: ApplicationStatus.APPLIED,
      notes: 'Test notes',
      deadline: '2024-12-31',
    }
    
    render(<ApplicationForm mode="edit" initialData={initialData} />)
    
    expect(screen.getByText(/edit internship application/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Google')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm mode="create" />)
    
    const submitButton = screen.getByRole('button', { name: /create application/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/role is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data in create mode', async () => {
    const user = userEvent.setup()
    const mockOnSuccess = jest.fn()
    mockCreate.mockResolvedValue({ success: true, data: { id: '1' } })
    
    render(<ApplicationForm mode="create" onSuccess={mockOnSuccess} />)
    
    // Fill out the form
    await user.type(screen.getByLabelText(/company/i), 'Google')
    await user.type(screen.getByLabelText(/role/i), 'Software Engineer')
    await user.selectOptions(screen.getByLabelText(/platform/i), 'COMPANY_WEBSITE')
    await user.selectOptions(screen.getByLabelText(/status/i), 'APPLIED')
    
    const submitButton = screen.getByRole('button', { name: /create application/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
        company: 'Google',
        role: 'Software Engineer',
        platform: 'COMPANY_WEBSITE',
        status: 'APPLIED',
      }))
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('submits form with valid data in edit mode', async () => {
    const user = userEvent.setup()
    const initialData = {
      id: '1',
      company: 'Google',
      role: 'Software Engineer',
      platform: ApplicationPlatform.COMPANY_WEBSITE,
      status: ApplicationStatus.APPLIED,
      notes: '',
      deadline: '',
    }
    const mockOnSuccess = jest.fn()
    mockUpdate.mockResolvedValue({ success: true, data: initialData })
    
    render(<ApplicationForm mode="edit" initialData={initialData} onSuccess={mockOnSuccess} />)
    
    // Update the company name
    const companyInput = screen.getByDisplayValue('Google')
    await user.clear(companyInput)
    await user.type(companyInput, 'Microsoft')
    
    const submitButton = screen.getByRole('button', { name: /update application/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
        company: 'Microsoft',
      }))
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('shows character count for notes field', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm mode="create" />)
    
    const notesField = screen.getByLabelText(/notes/i)
    await user.type(notesField, 'Test notes')
    
    expect(screen.getByText('10/1000')).toBeInTheDocument()
  })

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm mode="create" />)
    
    // Fill out some fields
    await user.type(screen.getByLabelText(/company/i), 'Google')
    await user.type(screen.getByLabelText(/role/i), 'Software Engineer')
    
    // Click reset
    const resetButton = screen.getByRole('button', { name: /reset/i })
    await user.click(resetButton)
    
    // Check that fields are cleared
    expect(screen.getByLabelText(/company/i)).toHaveValue('')
    expect(screen.getByLabelText(/role/i)).toHaveValue('')
  })
})