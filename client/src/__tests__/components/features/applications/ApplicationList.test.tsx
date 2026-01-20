import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationList } from '@/components/features/applications/ApplicationList'
import { mockApplications } from '@/__tests__/utils/test-utils'

// Mock the API
jest.mock('@/lib/api', () => ({
  applications: {
    list: jest.fn(),
  },
}))

const mockApiList = require('@/lib/api').applications.list

describe('ApplicationList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockApiList.mockResolvedValue({
      success: true,
      data: mockApplications,
      pagination: {
        page: 1,
        limit: 10,
        total: mockApplications.length,
        totalPages: 1,
      },
    })
  })

  it('renders application list', async () => {
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/tech corp/i)).toBeInTheDocument()
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument()
      expect(screen.getByText(/startupxyz/i)).toBeInTheDocument()
      expect(screen.getByText(/frontend developer/i)).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    mockApiList.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<ApplicationList />)
    
    expect(screen.getByText(/loading applications/i)).toBeInTheDocument()
  })

  it('shows empty state when no applications', async () => {
    mockApiList.mockResolvedValue({
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    })
    
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/no applications found/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /create your first application/i })).toBeInTheDocument()
    })
  })

  it('filters applications by status', async () => {
    const user = userEvent.setup()
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/tech corp/i)).toBeInTheDocument()
    })
    
    const statusFilter = screen.getByLabelText(/filter by status/i)
    await user.selectOptions(statusFilter, 'APPLIED')
    
    await waitFor(() => {
      expect(mockApiList).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'APPLIED',
        })
      )
    })
  })

  it('filters applications by platform', async () => {
    const user = userEvent.setup()
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/tech corp/i)).toBeInTheDocument()
    })
    
    const platformFilter = screen.getByLabelText(/filter by platform/i)
    await user.selectOptions(platformFilter, 'LINKEDIN')
    
    await waitFor(() => {
      expect(mockApiList).toHaveBeenCalledWith(
        expect.objectContaining({
          platform: 'LINKEDIN',
        })
      )
    })
  })

  it('searches applications', async () => {
    const user = userEvent.setup()
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/tech corp/i)).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search applications/i)
    await user.type(searchInput, 'Tech Corp')
    
    await waitFor(() => {
      expect(mockApiList).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Tech Corp',
        })
      )
    })
  })

  it('handles pagination', async () => {
    const user = userEvent.setup()
    mockApiList.mockResolvedValue({
      success: true,
      data: mockApplications,
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    })
    
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
    })
    
    const nextButton = screen.getByRole('button', { name: /next page/i })
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(mockApiList).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      )
    })
  })

  it('shows application status badges', async () => {
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/applied/i)).toBeInTheDocument()
      expect(screen.getByText(/interview/i)).toBeInTheDocument()
    })
    
    const appliedBadge = screen.getByText(/applied/i)
    expect(appliedBadge).toHaveClass('bg-blue-100', 'text-blue-800')
    
    const interviewBadge = screen.getByText(/interview/i)
    expect(interviewBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('shows application actions', async () => {
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: /view/i })).toHaveLength(2)
      expect(screen.getAllByRole('link', { name: /edit/i })).toHaveLength(2)
    })
  })

  it('handles API errors gracefully', async () => {
    mockApiList.mockRejectedValue(new Error('API Error'))
    
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load applications/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })
  })

  it('retries loading on error', async () => {
    const user = userEvent.setup()
    mockApiList.mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValue({
        success: true,
        data: mockApplications,
        pagination: {
          page: 1,
          limit: 10,
          total: mockApplications.length,
          totalPages: 1,
        },
      })
    
    render(<ApplicationList />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load applications/i)).toBeInTheDocument()
    })
    
    const retryButton = screen.getByRole('button', { name: /try again/i })
    await user.click(retryButton)
    
    await waitFor(() => {
      expect(screen.getByText(/tech corp/i)).toBeInTheDocument()
    })
  })
})