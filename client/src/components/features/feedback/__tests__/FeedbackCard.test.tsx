import { render, screen } from '@testing-library/react'
import { FeedbackCard } from '../FeedbackCard'
import { FeedbackTag, FeedbackPriority } from '@/lib/types'

const mockFeedback = {
  id: 'f1',
  applicationId: 'a1',
  mentorId: 'm1',
  content: 'Great progress on your technical skills! Focus on system design concepts for the upcoming interview.',
  tags: [FeedbackTag.DSA, FeedbackTag.SYSTEM_DESIGN],
  priority: FeedbackPriority.HIGH,
  createdAt: '2024-01-16T09:00:00Z',
  updatedAt: '2024-01-16T09:00:00Z',
  mentor: {
    id: 'm1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
}

describe('FeedbackCard Component', () => {
  it('renders feedback content correctly', () => {
    render(<FeedbackCard feedback={mockFeedback} />)
    
    expect(screen.getByText(/great progress on your technical skills/i)).toBeInTheDocument()
  })

  it('displays mentor information', () => {
    render(<FeedbackCard feedback={mockFeedback} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
  })

  it('shows mentor avatar with initials when no profile image', () => {
    render(<FeedbackCard feedback={mockFeedback} />)
    
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('displays feedback tags', () => {
    render(<FeedbackCard feedback={mockFeedback} />)
    
    expect(screen.getByText('DSA')).toBeInTheDocument()
    expect(screen.getByText('System Design')).toBeInTheDocument()
  })

  it('shows priority badge', () => {
    render(<FeedbackCard feedback={mockFeedback} />)
    
    expect(screen.getByText('High Priority')).toBeInTheDocument()
  })

  it('displays creation date', () => {
    render(<FeedbackCard feedback={mockFeedback} />)
    
    expect(screen.getByText(/jan 16, 2024/i)).toBeInTheDocument()
  })

  it('handles feedback with different priority levels', () => {
    const { rerender } = render(<FeedbackCard feedback={mockFeedback} />)
    expect(screen.getByText('High Priority')).toBeInTheDocument()

    const mediumPriorityFeedback = {
      ...mockFeedback,
      priority: FeedbackPriority.MEDIUM,
    }
    rerender(<FeedbackCard feedback={mediumPriorityFeedback} />)
    expect(screen.getByText('Medium Priority')).toBeInTheDocument()

    const lowPriorityFeedback = {
      ...mockFeedback,
      priority: FeedbackPriority.LOW,
    }
    rerender(<FeedbackCard feedback={lowPriorityFeedback} />)
    expect(screen.getByText('Low Priority')).toBeInTheDocument()
  })

  it('handles mentor without first/last name', () => {
    const feedbackWithEmailOnly = {
      ...mockFeedback,
      mentor: {
        id: 'm1',
        email: 'mentor@example.com',
        firstName: undefined,
        lastName: undefined,
      },
    }
    
    render(<FeedbackCard feedback={feedbackWithEmailOnly} />)
    
    expect(screen.getByText('mentor@example.com')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument() // First letter of email
  })

  it('handles empty tags array', () => {
    const feedbackWithoutTags = {
      ...mockFeedback,
      tags: [],
    }
    
    render(<FeedbackCard feedback={feedbackWithoutTags} />)
    
    expect(screen.queryByText('DSA')).not.toBeInTheDocument()
    expect(screen.queryByText('System Design')).not.toBeInTheDocument()
  })

  it('truncates long feedback content', () => {
    const longFeedback = {
      ...mockFeedback,
      content: 'This is a very long feedback content that should be truncated when it exceeds the maximum length limit. '.repeat(10),
    }
    
    render(<FeedbackCard feedback={longFeedback} />)
    
    // Should show truncated content with "Show more" button
    expect(screen.getByText(/show more/i)).toBeInTheDocument()
  })
})