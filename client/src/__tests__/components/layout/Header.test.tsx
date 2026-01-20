import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'
import { AuthContext } from '@/contexts/AuthContext'
import { mockAuthContextValue, mockUnauthenticatedContextValue } from '@/__tests__/utils/test-utils'

const renderHeader = (authContext = mockAuthContextValue) => {
  return render(
    <AuthContext.Provider value={authContext}>
      <Header />
    </AuthContext.Provider>
  )
}

describe('Header Component', () => {
  it('renders brand logo and name', () => {
    renderHeader()
    
    expect(screen.getByText(/uimp/i)).toBeInTheDocument()
    expect(screen.getByText(/unified internship & mentorship portal/i)).toBeInTheDocument()
  })

  it('shows user menu when authenticated', () => {
    renderHeader(mockAuthContextValue)
    
    expect(screen.getByText(/test user/i)).toBeInTheDocument()
    expect(screen.getByText(/student/i)).toBeInTheDocument()
  })

  it('shows login/signup buttons when not authenticated', () => {
    renderHeader(mockUnauthenticatedContextValue)
    
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows notification bell when authenticated', () => {
    renderHeader(mockAuthContextValue)
    
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('does not show notification bell when not authenticated', () => {
    renderHeader(mockUnauthenticatedContextValue)
    
    expect(screen.queryByRole('button', { name: /notifications/i })).not.toBeInTheDocument()
  })

  it('has proper navigation structure', () => {
    renderHeader()
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('bg-white', 'shadow-sm')
  })

  it('is responsive', () => {
    renderHeader()
    
    const container = screen.getByRole('navigation').firstChild
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
  })

  it('has proper accessibility attributes', () => {
    renderHeader()
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })
})