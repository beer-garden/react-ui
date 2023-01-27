import LoadingButton from '@mui/lab/LoadingButton'
import useGardens from 'hooks/useGardens'
import { useMountedState } from 'hooks/useMountedState'
import { SnackbarState } from 'types/custom-types'

interface GardenSynButtonParams {
  gardenName: string
  setSyncStatus: (arg0: SnackbarState) => void
}

const GardenSyncButton = ({
  gardenName,
  setSyncStatus,
}: GardenSynButtonParams) => {
  const { loading, syncGarden } = useGardens()
  const [isLoading, setIsLoading] = useMountedState<boolean>(false)

  const handleClick = () => {
    syncGarden(gardenName)
      .then(() => {
        setSyncStatus({
          severity: 'success',
          message: 'Garden sync successful',
          showSeverity: false,
        })
      })
      .catch((error) => {
        if (error.response) {
          setSyncStatus({
            severity: 'error',
            message: `${error.response.data.message}`,
            doNotAutoDismiss: true,
          })
        } else {
          setSyncStatus({
            severity: 'error',
            message: `${error}`,
          })
        }
      })
    setIsLoading(loading)
  }

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleClick}
      loading={isLoading}
      loadingIndicator="Loading"
    >
      Sync
    </LoadingButton>
  )
}

export { GardenSyncButton }
