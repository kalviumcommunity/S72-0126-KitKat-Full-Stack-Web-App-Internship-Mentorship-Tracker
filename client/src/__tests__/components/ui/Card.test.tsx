import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/Card'

describe('Card Component', () => {
  it('renders card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText(/card content/i)).toBeInTheDocument()
  })

  it('renders with header', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
        </Card.Header>
        <Card.Content>Content</Card.Content>
      </Card>
    )
    
    expect(screen.getByText(/card title/i)).toBeInTheDocument()
    expect(screen.getByText(/content/i)).toBeInTheDocument()
  })

  it('renders with footer', () => {
    render(
      <Card>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    )
    
    expect(screen.getByText(/content/i)).toBeInTheDocument()
    expect(screen.getByText(/footer content/i)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-card">
        <div>Content</div>
      </Card>
    )
    
    const card = screen.getByText(/content/i).closest('.custom-card')
    expect(card).toBeInTheDocument()
  })

  it('supports different variants', () => {
    const { rerender } = render(
      <Card variant="default">
        <div>Default card</div>
      </Card>
    )
    
    let card = screen.getByText(/default card/i).closest('div')
    expect(card).toHaveClass('bg-white')

    rerender(
      <Card variant="outlined">
        <div>Outlined card</div>
      </Card>
    )
    
    card = screen.getByText(/outlined card/i).closest('div')
    expect(card).toHaveClass('border')
  })

  it('can be clickable', () => {
    const handleClick = jest.fn()
    render(
      <Card onClick={handleClick}>
        <div>Clickable card</div>
      </Card>
    )
    
    const card = screen.getByText(/clickable card/i).closest('div')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('has proper accessibility attributes when clickable', () => {
    const handleClick = jest.fn()
    render(
      <Card onClick={handleClick}>
        <div>Clickable card</div>
      </Card>
    )
    
    const card = screen.getByText(/clickable card/i).closest('div')
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabIndex', '0')
  })
})