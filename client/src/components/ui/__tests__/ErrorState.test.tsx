import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorState } from '../ErrorState'

describe('ErrorState Component', () => {
  it('renders error state with title and message', () => {
    render(
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred"
      />
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const mockRetry = jest.fn()
    render(
      <ErrorState
        title="Error"
        message="Failed to load"
        onRetry={mockRetry}
      />
    )
    
    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
    
    fireEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('shows go back button when onGoBack is provided', () => {
    const mockGoBack = jest.fn()
    render(
      <ErrorState
        title="Error"
        message="Page not found"
        onGoBack={mockGoBack}
      />
    )
    
    const goBackButton = screen.getByRole('button', { name: /go back/i })
    expect(goBackButton).toBeInTheDocument()
    
    fireEvent.click(goBackButton)
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('displays custom icon when provided', () => {
    render(
      <ErrorState
        title="Error"
        message="Failed"
        icon="🚫"
      />
    )
    
    expect(screen.getByText('🚫')).toBeInTheDocument()
  })

  it('shows default error icon when no icon provided', () => {
    render(
      <ErrorState
        title="Error"
        message="Failed"
      />
    )
    
    // Should show default error icon (⚠️)
    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  it('handles network error state', () => {
    render(
      <ErrorState
        title="Network Error"
        message="Please check your internet connection"
        onRetry={jest.fn()}
      />
    )
    
    expect(screen.getByText('Network Error')).toBeInTheDocument()
    expect(screen.getByText('Please check your internet connection')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('handles 404 not found state', () => {
    render(
      <ErrorState
        title="Page Not Found"
        message="The page you're looking for doesn't exist"
        onGoBack={jest.fn()}
      />
    )
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    expect(screen.getByText("The page you're looking for doesn't exist")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  it('handles unauthorized error state', () => {
    render(
      <ErrorState
        title="Access Denied"
        message="You don't have permission to view this page"
      />
    )
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
    expect(screen.getByText("You don't have permission to view this page")).toBeInTheDocument()
  })
})