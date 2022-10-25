import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Correctly find and change MUI Select input
 *
 * @param label Select label
 * @param choice MenuItem value to change to
 */
export async function selectItem(label: string, choice: string): Promise<void> {
  const selectEl = await screen.findByLabelText(label)
  expect(selectEl).toBeInTheDocument()
  userEvent.click(selectEl)
  // Locate the corresponding popup (`listbox`) of options
  const optionsPopupEl = await screen.findByRole('listbox', {
    name: label,
  })
  // Click an option in the popup
  userEvent.click(within(optionsPopupEl).getByText(choice))
}
