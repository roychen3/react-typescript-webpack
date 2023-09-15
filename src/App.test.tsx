import { render, screen, fireEvent } from '@testing-library/react'

import App from '@/src/App'

it('should render the Vite and React logos', () => {
  render(<App />)
  const viteLogo = screen.getByAltText('Vite logo')
  const reactLogo = screen.getByAltText('React logo')
  expect(viteLogo).toBeInTheDocument()
  expect(reactLogo).toBeInTheDocument()
})

it('should render the title "Vite + React"', () => {
  render(<App />)
  const title = screen.getByText('Vite + React')
  expect(title).toBeInTheDocument()
})

it('should render a card with a button that increments the counter when clicked', () => {
  render(<App />)
  const button = screen.getByRole('button', { name: /count is \d+/i })
  fireEvent.click(button)
  expect(button).toHaveTextContent(/count is \d+/i)
})
