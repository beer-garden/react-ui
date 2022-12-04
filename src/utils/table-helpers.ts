/**
 * Calculates list of options for 'Rows per page' selection in a
 * TablePagination component to account for a max number of rows
 * @param maxRows number Cap on number of rows to display at once
 * @param totalRows number Total number of rows in table
 * @returns array List of options
 */
export const getRowPageOptions = (
  maxRows: number,
  totalRows: number,
): (number | { value: number; label: string })[] => {
  if (!totalRows) return []

  const optionList: (number | { value: number; label: string })[] = []
  let i = 5
  for (i; i <= maxRows; i += 5) {
    optionList.push(i)
    if (i >= 50) i += 20 // after 50 count by 25
    else if (i >= 20) i += 5 // after 20 count by 10
  }
  if (totalRows <= maxRows) optionList.push({ value: i, label: 'All' })
  return optionList
}
