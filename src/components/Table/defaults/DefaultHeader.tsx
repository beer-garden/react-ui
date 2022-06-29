import { TableData } from 'components/Table'
import { HeaderProps } from 'react-table'

const isUpper = (code: number) => code >= 65 && code <= 90
const isDigit = (code: number) => code >= 48 && code <= 57

const convertCamelCase = (camel: string) => {
  let newKey = ''
  let code: number
  let wasPrevNumber = true
  let wasPrevUppercase = true

  for (let index = 0; index < camel.length; index++) {
    code = camel.charCodeAt(index)
    const codeIsUpper = isUpper(code)
    const codeIsDigit = isDigit(code)

    if (index === 0) {
      newKey += camel[index].toUpperCase()
    } else if (
      (!wasPrevUppercase && codeIsUpper) ||
      (!wasPrevNumber && codeIsDigit)
    ) {
      newKey += ' ' + camel[index].toUpperCase()
    } else {
      newKey += camel[index].toLowerCase()
    }

    wasPrevNumber = codeIsDigit
    wasPrevUppercase = codeIsUpper
  }

  return newKey
}

const DefaultHeader = ({ column }: HeaderProps<TableData>) => (
  <>{column.id.startsWith('_') ? null : convertCamelCase(column.id)}</>
)

export { DefaultHeader }
