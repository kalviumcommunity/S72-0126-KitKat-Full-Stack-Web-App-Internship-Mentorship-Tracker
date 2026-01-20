import { render, screen } from '@testing-library/react'
import { ApplicationCard } from '../ApplicationCard'
import { ApplicationStatus, ApplicationPlatform } from '@/lib/types'

const mockApplication = {
  id: '1',
  userId: 'user1',
  company: 'Google',
  role: 'Software Engineer Intern',
  platform: ApplicationPlatform.COMPANY_WEBSITE,
  status: ApplicationStatus.APPLIED,
  resumeUrl: 'https://example.com/resume.pdf',
  notes: 'Applied through university career portal',
  deadline: '2024-12-31T23:59:59Z',
  appliedDate: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  feedback: [],
}

describe('ApplicationCard Component', () => {
  it('renders application information correctly', () => {
    render(<ApplicationCard application={mockApplication} />)
    
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument()
    expect(screen.getByText('Company Website')).toBeInTheDocument()
  })

  it('displays application status badge', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('shows deadline when provided', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText(/deadline/i)).toBeInTheDocument()
  })

  it('shows applied date when provided', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText(/applied/i)).toBeInTheDocument()
  })

  it('displays notes when provided', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText('Applied through university career portal')).toBeInTheDocument()
  })

  it('shows feedback count when feedback exists', () => {
    const applicationWithFeedback = {
      ...mockApplication,
      feedback: [
        {
          id: 'f1',
          applicationId: '1',
          mentorId: 'm1',
          content: 'Great application!',
          tags: [],
          priority: 'MEDIUM' as const,
          createdAt: '2024-01-16T09:00:00Z',
          updatedAt: '2024-01-16T09:00:00Z',
          mentor: {
            id: 'm1',
            email: 'mentor@example.com',
            firstName: 'John',
            lastName: 'Mentor',
          },
        },
      ],
    }
    
    render(<ApplicationCard application={applicationWithFeedback} />)
    expect(screen.getByText('1 feedback')).toBeInTheDocument()
  })

  it('shows resume link when resume URL is provided', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByRole('link', { name: /view resume/i })).toHaveAttribute(
      'href',
      'https://example.com/resume.pdf'
    )
  })

  it('shows edit and view buttons', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByRole('link', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view details/i })).toBeInTheDocument()
  })

  it('handles application without optional fields', () => {
    const minimalApplication = {
      ...mockApplication,
      resumeUrl: undefined,
      notes: undefined,
      deadline: undefined,
      appliedDate: undefined,
    }
    
    render(<ApplicationCard application={minimalApplication} />)
    
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument()
    expect(screen.queryByText(/deadline/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/applied/i)).not.toBeInTheDocument()
  })
})