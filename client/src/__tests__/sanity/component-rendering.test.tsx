import { render, screen } from '@testing-library/react'

// Test that components can be imported and rendered without crashing
describe('Component Rendering Sanity Tests', () => {
  it('renders without crashing - basic components', () => {
    // Test basic HTML elements render
    render(<div>Test Content</div>)
    expect(screen.getByText(/test content/i)).toBeInTheDocument()
  })

  it('handles props correctly', () => {
    const TestComponent = ({ title }: { title: string }) => (
      <h1>{title}</h1>
    )
    
    render(<TestComponent title="Test Title" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title')
  })

  it('handles conditional rendering', () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => (
      <div>
        {show && <span>Visible Content</span>}
        {!show && <span>Hidden Content</span>}
      </div>
    )
    
    const { rerender } = render(<ConditionalComponent show={true} />)
    expect(screen.getByText(/visible content/i)).toBeInTheDocument()
    
    rerender(<ConditionalComponent show={false} />)
    expect(screen.getByText(/hidden content/i)).toBeInTheDocument()
  })

  it('handles lists and iterations', () => {
    const items = ['Item 1', 'Item 2', 'Item 3']
    
    const ListComponent = () => (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )
    
    render(<ListComponent />)
    
    items.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('handles form elements', () => {
    render(
      <form>
        <label htmlFor="test-input">Test Input</label>
        <input id="test-input" type="text" />
        <button type="submit">Submit</button>
      </form>
    )
    
    expect(screen.getByLabelText(/test input/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
})