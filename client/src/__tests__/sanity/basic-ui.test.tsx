import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

describe('Basic UI Components Sanity Tests', () => {
  describe('Button Component', () => {
    it('renders and is clickable', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Test Button</Button>)
      
      const button = screen.getByRole('button', { name: /test button/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it('can be disabled', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Input Component', () => {
    it('renders with label', () => {
      render(<Input label="Test Input" />)
      
      expect(screen.getByLabelText(/test input/i)).toBeInTheDocument()
    })

    it('shows error state', () => {
      render(<Input label="Test" error="Error message" />)
      
      expect(screen.getByText(/error message/i)).toBeInTheDocument()
    })
  })

  describe('Card Component', () => {
    it('renders children', () => {
      render(
        <Card>
          <div>Card Content</div>
        </Card>
      )
      
      expect(screen.getByText(/card content/i)).toBeInTheDocument()
    })
  })
})