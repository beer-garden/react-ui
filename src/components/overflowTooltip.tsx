import Tooltip from '@material-ui/core/Tooltip'
import { Typography, TypographyTypeMap } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface OverflowTooltipProps {
  tooltip: string
  text: string
  css: { [key: string]: unknown }
  variant: TypographyTypeMap['props']['variant']
  color?: string
}

const OverflowTooltip = (props: OverflowTooltipProps) => {
  const textElementRef = useRef<HTMLInputElement | null>(null)
  const [isOverflowed, setIsOverflow] = useState(false)

  const compareSize = () => {
    if (textElementRef.current) {
      setIsOverflow(
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth,
      )
    }
  }

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [])

  return (
    <Tooltip title={props.tooltip} disableHoverListener={!isOverflowed}>
      <Typography
        variant={props.variant}
        ref={textElementRef}
        sx={{
          ...props.css,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
        color={props.color}
      >
        {props.text}
      </Typography>
    </Tooltip>
  )
}

export default OverflowTooltip
