import { Box, Button, Tooltip } from '@mui/material'
import { CommandBasicPropertiesType } from 'formHelpers'
import { useMemo } from 'react'

import { DynamicChoicesStateManager } from './useChoicesState'

interface SubmitButtonProps {
  schemaProperties: CommandBasicPropertiesType
  stateManager: DynamicChoicesStateManager
}

const SubmitButton = ({
  schemaProperties,
  stateManager,
}: SubmitButtonProps) => {
  const [canSubmit, mustChoose] = useMemo(() => {
    let canSubmit = true
    let mustChoose: string[] = []
    const instanceIsRequired = 'required' in schemaProperties.instance_names
    const parametersRequired = schemaProperties.parameters.required

    if (instanceIsRequired) {
      canSubmit &&= stateManager.model.get().instance_name !== ''
      mustChoose = mustChoose.concat(['instance'])
    }

    if (parametersRequired.length > 0) {
      const params = stateManager.model.get().parameters
      mustChoose = mustChoose.concat(parametersRequired)
<<<<<<< HEAD
      canSubmit &&= parametersRequired.every((p) => params[p] !== '')
=======
      canSubmit &&= parametersRequired
        .map((p) => params[p] !== '')
        .every((r) => r)
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
    }

    return [canSubmit, mustChoose]
  }, [
    schemaProperties.instance_names,
    schemaProperties.parameters.required,
    stateManager.model,
  ])

  const button = (
    <Button
      color="primary"
      variant="contained"
      type="submit"
      disabled={!canSubmit}
    >
      Execute
    </Button>
  )

  if (canSubmit) return button

  let toolTipTitle = ''

  if (mustChoose.length === 1) {
    toolTipTitle = `Must choose '${mustChoose[0]}'`
  } else if (mustChoose.length > 1) {
    const start = mustChoose
      .slice(0, -1)
      // eslint-disable-next-line quotes
      .map((s) => "'" + s + "'")
      .join(', ')
    // eslint-disable-next-line quotes
    const last = "'" + mustChoose[mustChoose.length - 1] + "'"
    toolTipTitle = `Must choose ${start} and ${last}`
  }

  return (
    <Tooltip title={toolTipTitle}>
      <Box component={'span'}>{button}</Box>
    </Tooltip>
  )
}

export { SubmitButton }
