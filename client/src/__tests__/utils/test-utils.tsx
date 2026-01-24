import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'

// Mock user data for testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  role: 'STUDENT' as const,
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockMentor = {
  id: '2',
  email: 'mentor@example.com',
  role: 'MENTOR' as const,
  firstName: 'Test',
  lastName: 'Mentor',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock AuthContext values
export const mockAuthContextValue = {
  user: mockUser,
  isLoading: false,
  isAuthenticated: true,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshUser: () => Promise.resolve(),
}

export const mockUnauthenticatedContextValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshUser: () => Promise.resolve(),
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock API responses
export const mockApplications = [
  {
    id: '1',
    company: 'Tech Corp',
    role: 'Software Engineer',
    platform: 'LINKEDIN',
    status: 'APPLIED',
    notes: 'Great opportunity',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    company: 'StartupXYZ',
    role: 'Frontend Developer',
    platform: 'COMPANY_WEBSITE',
    status: 'INTERVIEW',
    notes: 'Exciting startup',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockFeedback = [
  {
    id: '1',
    applicationId: '1',
    mentorId: '2',
    content: 'Great application! Consider improving your resume.',
    tags: ['RESUME'],
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    applicationId: '2',
    mentorId: '2',
    content: 'Good progress on DSA skills.',
    tags: ['DSA'],
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Test helpers
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

export const createMockFormEvent = (values: Record<string, any>) => ({
  preventDefault: () => {},
  target: {
    elements: Object.keys(values).reduce((acc, key) => {
      acc[key] = { value: values[key] }
      return acc
    }, {} as any),
  },
})

// Accessibility test helper
export const checkAccessibility = async (container: HTMLElement) => {
  // Check for basic accessibility attributes
  const buttons = container.querySelectorAll('button')
  const inputs = container.querySelectorAll('input')
  const labels = container.querySelectorAll('label')
  
  // Ensure buttons have accessible names
  buttons.forEach(button => {
    const hasAccessibleName = button.textContent || 
      button.getAttribute('aria-label') || 
      button.getAttribute('title')
    if (!hasAccessibleName) {
      console.warn('Button without accessible name found')
    }
  })
  
  // Ensure inputs have labels or aria-labels
  inputs.forEach(input => {
    const hasLabel = labels.length > 0 || 
      input.getAttribute('aria-label') || 
      input.getAttribute('aria-labelledby')
    if (!hasLabel) {
      console.warn('Input without label found')
    }
  })
}