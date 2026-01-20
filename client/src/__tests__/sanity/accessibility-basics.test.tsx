import { render, screen } from '@testing-library/react'

describe('Basic Accessibility Sanity Tests', () => {
  it('form elements have proper labels', () => {
    render(
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required />
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required />
        
        <button type="submit">Submit</button>
      </form>
    )
    
    // Check inputs are properly labeled
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    
    // Check button is accessible
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('buttons have accessible names', () => {
    render(
      <div>
        <button>Click Me</button>
        <button aria-label="Close dialog">×</button>
        <button title="Save document">💾</button>
      </div>
    )
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /💾/i })).toBeInTheDocument()
  })

  it('headings have proper hierarchy', () => {
    render(
      <div>
        <h1>Main Title</h1>
        <h2>Section Title</h2>
        <h3>Subsection Title</h3>
      </div>
    )
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Title')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection Title')
  })

  it('lists have proper structure', () => {
    render(
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
    )
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('images have alt text', () => {
    render(
      <div>
        <img src="/test.jpg" alt="Test image description" />
        <img src="/decorative.jpg" alt="" role="presentation" />
      </div>
    )
    
    expect(screen.getByAltText(/test image description/i)).toBeInTheDocument()
    
    // Decorative images should have empty alt text
    const decorativeImg = screen.getByRole('presentation')
    expect(decorativeImg).toHaveAttribute('alt', '')
  })

  it('form validation errors are announced', () => {
    render(
      <div>
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          type="email" 
          aria-invalid="true"
          aria-describedby="email-error"
        />
        <div id="email-error" role="alert">
          Please enter a valid email address
        </div>
      </div>
    )
    
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
    
    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i)
  })
})