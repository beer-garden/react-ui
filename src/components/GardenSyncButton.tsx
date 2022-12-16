import LoadingButton from '@mui/lab/LoadingButton'
import useGardens from 'hooks/useGardens'
import { Dispatch, SetStateAction, useState } from 'react'
import { SnackbarState } from 'types/custom-types'

interface GardenSynButtonParams {
  gardenName: string
  setSyncStatus: Dispatch<SetStateAction<SnackbarState | undefined>>
}

const GardenSyncButton = ({
  gardenName,
  setSyncStatus,
}: GardenSynButtonParams) => {
  const { loading, syncGarden } = useGardens()
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
