export interface modalProps {
  header: string
  open: boolean
  content: JSX.Element
  onClose(): void
  onCancel(): void
  onSubmit(): void
}
