import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/layout/Sidebar'
import { AuthContext } from '@/contexts/AuthContext'
import { mockAuthContextValue, mockMentor } from '@/__tests__/utils/test-utils'

const mockMentorContext = {
  ...mockAuthContextValue,
  user: mockMentor,
}

const renderSidebar = (authContext = mockAuthContextValue) => {
  return render(
    <AuthContext.Provider value={authContext}>
      <Sidebar />
    </AuthContext.Provider>
  )
}

describe('Sidebar Component', () => {
  it('renders user information', () => {
    renderSidebar()
    
    expect(screen.getByText(/test user/i)).toBeInTheDocument()
    expect(screen.getByText(/student/i)).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
  })

  it('shows student navigation for student users', () => {
    renderSidebar(mockAuthContextValue)
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /applications/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /feedback/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
  })

  it('shows mentor navigation for mentor users', () => {
    renderSidebar(mockMentorContext)
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /students/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /feedback/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
  })

  it('can be collapsed and expanded', async () => {
    const user = userEvent.setup()
    renderSidebar()
    
    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(toggleButton).toBeInTheDocument()
    
    await user.click(toggleButton)
    
    // When collapsed, text should be hidden but icons should remain
    const sidebar = screen.getByRole('navigation', { name: /sidebar/i })
    expect(sidebar).toHaveClass('w-16') // Collapsed width
  })

  it('shows logout button', () => {
    renderSidebar()
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('handles logout action', async () => {
    const user = userEvent.setup()
    const mockLogout = jest.fn()
    const contextWithLogout = {
      ...mockAuthContextValue,
      logout: mockLogout,
    }
    
    renderSidebar(contextWithLogout)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('highlights active navigation item', () => {
    // Mock usePathname to return a specific path
    jest.mock('next/navigation', () => ({
      usePathname: () => '/dashboard/student/applications',
    }))
    
    renderSidebar()
    
    const applicationsLink = screen.getByRole('link', { name: /applications/i })
    expect(applicationsLink).toHaveClass('bg-blue-50', 'text-blue-700')
  })

  it('has proper accessibility attributes', () => {
    renderSidebar()
    
    const sidebar = screen.getByRole('navigation', { name: /sidebar/i })
    expect(sidebar).toBeInTheDocument()
    
    const navList = screen.getByRole('list')
    expect(navList).toBeInTheDocument()
    
    const navItems = screen.getAllByRole('listitem')
    expect(navItems.length).toBeGreaterThan(0)
  })

  it('shows user avatar with initials', () => {
    renderSidebar()
    
    const avatar = screen.getByText(/tu/i) // Test User initials
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveClass('bg-blue-500', 'text-white')
  })

  it('is responsive on mobile', () => {
    renderSidebar()
    
    const sidebar = screen.getByRole('navigation', { name: /sidebar/i })
    expect(sidebar).toHaveClass('fixed', 'inset-y-0', 'left-0', 'z-50')
  })
})