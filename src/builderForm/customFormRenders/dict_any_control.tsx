import { ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { DictionaryAny } from 'builderForm/customFormRenders/dict_any_form'

const DictionaryAnyControl = (props: ControlProps) => (
  <DictionaryAny controlProps={props} />
)

export default withJsonFormsControlProps(DictionaryAnyControl)
