import { Box, Stack, Typography } from '@mui/material'
import { ParamArray, ParamCheckbox, ParamTextField } from 'pages/CommandView/ParameterElements'
import { Parameter } from 'types/backend-types'

interface ParameterElementProps {
  parameters?: Parameter[]
  parameter?: Parameter
  title?: string
  ignoreMulti? : boolean
  arrayIndex?: number
  parentKey: string
}

const ParameterElement = ({ parameter, parameters, title, ignoreMulti, arrayIndex, parentKey }: ParameterElementProps) => {
    
    if(parameters){
      return (
        <Box p={title ? 1 : 0} sx={title ? {border: 'solid 1px gray', borderRadius: 2} : {}} >
          {title && <Typography pb={1} variant="h3" >{title}</Typography>}
          <Stack rowGap={2}>
            {parameters.map((param: Parameter) => (
              <ParameterElement key={`${parentKey}.${param.key}`} parameter={param} parentKey={`${parentKey}`} />
            ))}
          </Stack>
        </Box>
      )
    }
    if(parameter){
      if(parameter.multi && !ignoreMulti){
        return (
          <ParamArray parameter={parameter} registerKey={`${parentKey}.${parameter.key}`}/>
        )
      }
      if(parameter.parameters.length > 0){
        return (
          <ParameterElement parameters={parameter.parameters} parentKey={typeof arrayIndex === 'number'? `${parentKey}.${arrayIndex}` : `${parentKey}.${parameter.key}`} title={ignoreMulti? ' ' : parameter.display_name} />
        )
      }
      if(parameter.type === 'Boolean') {
        return <ParamCheckbox parameter={parameter} registerKey={typeof arrayIndex === 'number'? `${parentKey}.${arrayIndex}` : `${parentKey}.${parameter.key}`} />
      }
      return <ParamTextField parameter={parameter} registerKey={typeof arrayIndex === 'number'? `${parentKey}.${arrayIndex}` : `${parentKey}.${parameter.key}`} />
    }
    return <></>
}

export { ParameterElement }
