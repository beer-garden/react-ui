import { Box, Tooltip, Typography, TypographyTypeMap } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

interface OverflowTooltipProps {
  tooltip: string
  text: string
  css: { [key: string]: unknown }
  variant: TypographyTypeMap['props']['variant']
  color?: string
  link?: string
}

const OverflowTooltip = (props: OverflowTooltipProps) => {
  const textElementRef = useRef<HTMLInputElement | null>(null)
  const [isOverflowed, setIsOverflow] = useMountedState<boolean>(false)

  const compareSize = useCallback(() => {
    if (textElementRef.current) {
      setIsOverflow(
        textElementRef.current.scrollWidth >=
          textElementRef.current.clientWidth,
      )
    }
  }, [setIsOverflow])

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [compareSize])

  return (
    <Tooltip title={props.tooltip} disableHoverListener={!isOverflowed}>
      <Box
        color={props.color}
        sx={{
          ...props.css,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {props.link ? (
          <Link to={props.link}>
            <Typography
              variant={props.variant}
              component={'span'}
              ref={textElementRef}
            >
              {props.text}
            </Typography>
          </Link>
        ) : (
          <Typography
            variant={props.variant}
            component={'span'}
            ref={textElementRef}
          >
            {props.text}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}

export default OverflowTooltip
