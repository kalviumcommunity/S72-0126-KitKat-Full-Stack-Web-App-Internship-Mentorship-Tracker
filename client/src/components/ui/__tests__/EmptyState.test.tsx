import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState Component', () => {
  it('renders empty state with title and description', () => {
    render(
      <EmptyState
        title="No applications found"
        description="You haven't created any applications yet"
      />
    )
    
    expect(screen.getByText('No applications found')).toBeInTheDocument()
    expect(screen.getByText("You haven't created any applications yet")).toBeInTheDocument()
  })

  it('shows action button when onAction is provided', () => {
    const mockAction = jest.fn()
    render(
      <EmptyState
        title="No applications"
        description="Get started by creating your first application"
        actionLabel="Create Application"
        onAction={mockAction}
      />
    )
    
    const actionButton = screen.getByRole('button', { name: /create application/i })
    expect(actionButton).toBeInTheDocument()
    
    fireEvent.click(actionButton)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('displays custom icon when provided', () => {
    render(
      <EmptyState
        title="No data"
        description="Nothing to show"
        icon="📝"
      />
    )
    
    expect(screen.getByText('📝')).toBeInTheDocument()
  })

  it('shows default empty icon when no icon provided', () => {
    render(
      <EmptyState
        title="Empty"
        description="No items"
      />
    )
    
    // Should show default empty icon (📄)
    expect(screen.getByText('📄')).toBeInTheDocument()
  })

  it('handles empty applications state', () => {
    render(
      <EmptyState
        title="No Applications Yet"
        description="Start your internship journey by creating your first application"
        actionLabel="Create Application"
        onAction={jest.fn()}
        icon="📋"
      />
    )
    
    expect(screen.getByText('No Applications Yet')).toBeInTheDocument()
    expect(screen.getByText('Start your internship journey by creating your first application')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create application/i })).toBeInTheDocument()
    expect(screen.getByText('📋')).toBeInTheDocument()
  })

  it('handles empty feedback state', () => {
    render(
      <EmptyState
        title="No Feedback Available"
        description="Your mentors haven't provided any feedback yet"
        icon="💬"
      />
    )
    
    expect(screen.getByText('No Feedback Available')).toBeInTheDocument()
    expect(screen.getByText("Your mentors haven't provided any feedback yet")).toBeInTheDocument()
    expect(screen.getByText('💬')).toBeInTheDocument()
  })

  it('handles search results empty state', () => {
    render(
      <EmptyState
        title="No Results Found"
        description="Try adjusting your search criteria or filters"
        actionLabel="Clear Filters"
        onAction={jest.fn()}
        icon="🔍"
      />
    )
    
    expect(screen.getByText('No Results Found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search criteria or filters')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('handles empty notifications state', () => {
    render(
      <EmptyState
        title="All Caught Up!"
        description="You have no new notifications"
        icon="🔔"
      />
    )
    
    expect(screen.getByText('All Caught Up!')).toBeInTheDocument()
    expect(screen.getByText('You have no new notifications')).toBeInTheDocument()
    expect(screen.getByText('🔔')).toBeInTheDocument()
  })
})