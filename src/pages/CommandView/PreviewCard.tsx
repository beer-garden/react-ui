
import { JsonCard } from 'components/JsonCard'
import { useFormContext } from 'react-hook-form'

const PreviewCard = () => {
  const {watch, getValues} = useFormContext()
  
  // triggers rerender when form data changes
  watch()
  
  const formData = getValues()

  if(Object.hasOwn(formData, 'multipart')) delete formData['multipart']
  return (<JsonCard title="Preview" data={formData} />)
}

export { PreviewCard }
