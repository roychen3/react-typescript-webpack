import { render, screen, fireEvent } from '@testing-library/react'

import ExampleComponent from '@/src/tests/ExampleComponent'

// Renders ExampleComponent with default values
it('should render ExampleComponent with default values', () => {
  render(<ExampleComponent />)
  expect(screen.getByTestId('result')).toHaveTextContent('result:0')
  expect(screen.getByTestId('a-input')).toHaveValue(0)
  expect(screen.getByTestId('b-input')).toHaveValue(0)
})

it('should update result when Calculate button is clicked', () => {
  render(<ExampleComponent />)
  const aInput = screen.getByTestId('a-input')
  const bInput = screen.getByTestId('b-input')
  const calculateBtn = screen.getByTestId('calculate-btn')

  fireEvent.change(aInput, { target: { value: '2' } })
  fireEvent.change(bInput, { target: { value: '3' } })
  fireEvent.click(calculateBtn)

  expect(screen.getByTestId('result')).toHaveTextContent('result:5')
})

it('should calculate sum when aInput and bInput are positive and negative numbers', () => {
  render(<ExampleComponent />)
  const aInput = screen.getByTestId('a-input')
  const bInput = screen.getByTestId('b-input')
  const calculateBtn = screen.getByTestId('calculate-btn')

  fireEvent.change(aInput, { target: { value: '2' } })
  fireEvent.change(bInput, { target: { value: '-3' } })
  fireEvent.click(calculateBtn)

  expect(screen.getByTestId('result')).toHaveTextContent('result:-1')
})

it('should calculate sum when aInput and bInput are non-numeric strings', () => {
  render(<ExampleComponent />)
  const aInput = screen.getByTestId('a-input')
  const bInput = screen.getByTestId('b-input')
  const calculateBtn = screen.getByTestId('calculate-btn')

  fireEvent.change(aInput, { target: { value: 'abc' } })
  fireEvent.change(bInput, { target: { value: 'def' } })
  fireEvent.click(calculateBtn)

  expect(screen.getByTestId('result')).toHaveTextContent('result:0')
})

it('should render ExampleComponent with custom default values', () => {
  render(<ExampleComponent defaultA={2} defaultB={3} />)
  expect(screen.getByTestId('result')).toHaveTextContent('result:0')
  expect(screen.getByTestId('a-input')).toHaveValue(2)
  expect(screen.getByTestId('b-input')).toHaveValue(3)
})
