import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import useAxios from 'axios-hooks'
import { Dispatch, SetStateAction, useState } from 'react'
import { SnackbarState } from 'types/custom-types'

interface GardenSynButtonParams {
  setSyncStatus: Dispatch<SetStateAction<SnackbarState | undefined>>
}

const GardenSyncAllButton = ({ setSyncStatus }: GardenSynButtonParams) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [{ loading }, execute] = useAxios(
    {
      url: '/api/v1/gardens/',
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
      .then(() =>
        setSyncStatus({
          severity: 'success',
          message: 'Garden sync successful',
          showSeverity: false,
        }),
      )
      .catch((error) => {
        console.error('ERROR', error)

        if (error.response) {
          setSyncStatus({
            severity: 'error',
            message: `${error.response.status} ${error.response.statusText}`,
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
    <Box style={{ float: 'right' }}>
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={handleClick}
        loading={isLoading}
        loadingIndicator="Loading"
      >
        Sync All
      </LoadingButton>
    </Box>
  )
}

export { GardenSyncAllButton }
