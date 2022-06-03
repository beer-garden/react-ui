import { Tooltip as MuiTooltip } from '@mui/material'
import { CSSProperties } from 'react'
import { CellProps } from 'react-table'
import { TableData } from '../Table'

interface TooltipCellProps {
  text: string
  tooltip?: string
  align: string
}

const TooltipCell = ({ text, tooltip = text, align }: TooltipCellProps) => {
  return tooltip ? (
    <MuiTooltip title={tooltip} style={{ textAlign: align } as CSSProperties}>
      <span>{text}</span>
    </MuiTooltip>
  ) : null
}

const TooltipCellRenderer = ({ cell: { value } }: CellProps<TableData>) => (
  <TooltipCell text={value} align={'left'} />
)

export default TooltipCellRenderer
