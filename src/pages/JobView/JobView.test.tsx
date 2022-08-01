import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { JobView } from './JobView'

test('renders Delete button', () => {
  render(
    <BrowserRouter>
      <JobView />
    </BrowserRouter>,
  )
  const testElement = screen.getByText('Delete Job')
  expect(testElement).toBeInTheDocument()
})

test('renders Update button', () => {
  render(
    <BrowserRouter>
      <JobView />
    </BrowserRouter>,
  )
  const testElement = screen.getByText('Update Job')
  expect(testElement).toBeInTheDocument()
})

// test('renders Pause button', () => {
//   render(
//     <BrowserRouter>
//       <JobView />
//     </BrowserRouter>,
//   )
//   const testElement = screen.getByText('Pause Job')
//   expect(testElement).toBeInTheDocument()
// })

// test('renders Resume button', () => {
//   render(
//     <BrowserRouter>
//       <JobView />
//     </BrowserRouter>,
//   )
//   const testElement = screen.getByText('Resume Job')
//   expect(testElement).toBeInTheDocument()
// })
