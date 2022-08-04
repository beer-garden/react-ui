import Tooltip from '@material-ui/core/Tooltip'
import { Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { OverflowTooltipProps } from 'types/custom_types'

const OverflowTooltip = (props: OverflowTooltipProps) => {
  const textElementRef = useRef<HTMLInputElement | null>(null)
  const [hoverStatus, setHover] = useState(false)

  const compareSize = () => {
    if (textElementRef.current) {
      const compare =
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth
      setHover(compare)
    }
  }

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
  }, [])
  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize)
    },
    [],
  )

  return (
    <Tooltip title={props.tooltip} disableHoverListener={!hoverStatus}>
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
