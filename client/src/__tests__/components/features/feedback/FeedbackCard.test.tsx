import { render, screen } from '@testing-library/react'
import { FeedbackCard } from '@/components/features/feedback/FeedbackCard'
import { mockFeedback, mockMentor } from '@/__tests__/utils/test-utils'

const mockFeedbackWithMentor = {
  ...mockFeedback[0],
  mentor: mockMentor,
  application: {
    id: '1',
    company: 'Tech Corp',
    role: 'Software Engineer',
  },
}

describe('FeedbackCard Component', () => {
  it('renders feedback content', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} />)
    
    expect(screen.getByText(/great application! consider improving your resume/i)).toBeInTheDocument()
  })

  it('shows mentor information', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} />)
    
    expect(screen.getByText(/test mentor/i)).toBeInTheDocument()
    expect(screen.getByText(/tm/i)).toBeInTheDocument() // Mentor initials
  })

  it('displays priority badge', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} />)
    
    const priorityBadge = screen.getByText(/high/i)
    expect(priorityBadge).toBeInTheDocument()
    expect(priorityBadge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('shows feedback tags', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} />)
    
    expect(screen.getByText(/resume/i)).toBeInTheDocument()
  })

  it('displays application link when provided', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} showApplicationLink />)
    
    expect(screen.getByText(/tech corp - software engineer/i)).toBeInTheDocument()
  })

  it('shows formatted timestamp', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} />)
    
    // Should show relative time like "just now", "2 hours ago", etc.
    expect(screen.getByText(/ago|just now|yesterday/i)).toBeInTheDocument()
  })

  it('handles different priority levels', () => {
    const mediumPriorityFeedback = {
      ...mockFeedbackWithMentor,
      priority: 'MEDIUM' as const,
    }
    
    const { rerender } = render(<FeedbackCard feedback={mediumPriorityFeedback} />)
    
    let priorityBadge = screen.getByText(/medium/i)
    expect(priorityBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    
    const lowPriorityFeedback = {
      ...mockFeedbackWithMentor,
      priority: 'LOW' as const,
    }
    
    rerender(<FeedbackCard feedback={lowPriorityFeedback} />)
    
    priorityBadge = screen.getByText(/low/i)
    expect(priorityBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('handles multiple tags', () => {
    const multiTagFeedback = {
      ...mockFeedbackWithMentor,
      tags: ['RESUME', 'DSA', 'COMMUNICATION'],
    }
    
    render(<FeedbackCard feedback={multiTagFeedback} />)
    
    expect(screen.getByText(/resume/i)).toBeInTheDocument()
    expect(screen.getByText(/dsa/i)).toBeInTheDocument()
    expect(screen.getByText(/communication/i)).toBeInTheDocument()
  })

  it('shows update indicator for recently updated feedback', () => {
    const recentlyUpdatedFeedback = {
      ...mockFeedbackWithMentor,
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    }
    
    render(<FeedbackCard feedback={recentlyUpdatedFeedback} />)
    
    expect(screen.getByText(/updated/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<FeedbackCard feedback={mockFeedbackWithMentor} />)
    
    const card = screen.getByRole('article')
    expect(card).toBeInTheDocument()
    
    const mentorInfo = screen.getByText(/test mentor/i)
    expect(mentorInfo).toBeInTheDocument()
  })

  it('handles missing mentor gracefully', () => {
    const feedbackWithoutMentor = {
      ...mockFeedback[0],
      mentor: null,
    }
    
    render(<FeedbackCard feedback={feedbackWithoutMentor} />)
    
    expect(screen.getByText(/unknown mentor/i)).toBeInTheDocument()
  })

  it('handles missing application gracefully', () => {
    const feedbackWithoutApplication = {
      ...mockFeedbackWithMentor,
      application: null,
    }
    
    render(<FeedbackCard feedback={feedbackWithoutApplication} showApplicationLink />)
    
    // Should not crash and should not show application link
    expect(screen.queryByText(/tech corp/i)).not.toBeInTheDocument()
  })

  it('truncates long feedback content', () => {
    const longFeedback = {
      ...mockFeedbackWithMentor,
      content: 'This is a very long feedback content that should be truncated after a certain number of characters to maintain good UI layout and readability. It should show an expand button or similar mechanism.',
    }
    
    render(<FeedbackCard feedback={longFeedback} />)
    
    // Should show truncated content or expand button
    expect(screen.getByText(/this is a very long feedback/i)).toBeInTheDocument()
  })
})