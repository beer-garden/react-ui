import { Box } from '@mui/material'
import { DefaultCellRenderer } from 'components/Table/defaults'
import { SelectionColumnFilter } from 'components/Table/filters'
import HiddenRenderer from 'components/Table/render/HiddenRenderer'
import {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  Ref,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Column, Row } from 'react-table'
import { CommandIndexTableData } from 'types/custom-types'

interface IndeterminateInputProps {
  indeterminate?: boolean
  changeCB?: (event: ChangeEvent<HTMLInputElement>) => void
}

/**
 * Takes in multiple useRefs and combines them into one
 * @param refs
 * @returns
 */
const useCombinedRefs = (
  ...refs: Array<Ref<HTMLInputElement> | MutableRefObject<null>>
): MutableRefObject<HTMLInputElement | null> => {
  const targetRef = useRef(null)

  useEffect(() => {
    refs.forEach((ref: Ref<HTMLInputElement> | MutableRefObject<null>) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IndeterminateInputProps
>(({ indeterminate, changeCB, ...rest }, ref: Ref<HTMLInputElement>) => {
  const defaultRef = useRef(null)
  const combinedRef = useCombinedRefs(ref, defaultRef)

  useEffect(() => {
    if (combinedRef.current) {
      combinedRef.current.indeterminate = indeterminate ?? false
    }
  }, [combinedRef, indeterminate])

  return (
    <Box sx={{ margin: '1px 0 0 -6px' }}>
      <input type="checkbox" ref={combinedRef} {...rest} />
    </Box>
  )
})
IndeterminateCheckbox.displayName = 'IndeterminateCheckBox'

/**
 *  Supply column info for Modal table, add checkbox as first column
 * @param handleClick CB for checkbox onClick
 * @returns
 */
const useModalColumns = () => {
  return useMemo<Column<CommandIndexTableData>[]>(
    () => [
      {
        id: '_selector',
        disableResizing: true,
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
        ),
        Cell: ({ row }: { row: Row<CommandIndexTableData> }) => (
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        ),
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        minWidth: 130,
        maxWidth: 180,
        width: 140,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'Command',
        accessor: 'command',
        Cell: HiddenRenderer,
        minWidth: 200,
        maxWidth: 400,
        width: 300,
      },
    ],
    [],
  )
}

const useTableColumns = () => {
  return useMemo<Column<CommandIndexTableData>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        minWidth: 130,
        maxWidth: 180,
        width: 140,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'Command',
        accessor: 'command',
        Cell: HiddenRenderer,
        minWidth: 200,
        maxWidth: 400,
        width: 320,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: SelectionColumnFilter,
        filter: 'includes',
        selectionOptions: ['CONFIRMED', 'ADD_REQUESTED', 'REMOVE_REQUESTED'],
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: '',
        Cell: DefaultCellRenderer,
        accessor: 'executeButton',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 85,
      },
    ],
    [],
  )
}

export { useModalColumns, useTableColumns }
