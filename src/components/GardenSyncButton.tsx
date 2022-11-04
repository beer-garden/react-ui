import LoadingButton from '@mui/lab/LoadingButton'
import useAxios from 'axios-hooks'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [{ loading }, execute] = useAxios(
    {
      url: '/api/v1/gardens/' + gardenName,
      method: 'PATCH',
    },
    { manual: true },
  )

  const patchData = {
    operations: [
      {
        operation: 'sync',
        path: '',
        value: '',
      },
    ],
  }

  const handleClick = () => {
    execute({
      data: patchData,
    })
      .then(() => {
        setSyncStatus({
          severity: 'success',
          message: 'Garden sync successful',
          showSeverity: false,
        })
      })
      .catch((error) => {
        console.error('ERROR', error)
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
