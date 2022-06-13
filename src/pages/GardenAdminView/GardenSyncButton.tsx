import LoadingButton from '@mui/lab/LoadingButton'
import { Button } from '@mui/material'
import useAxios from 'axios-hooks'
import { Dispatch, SetStateAction, useState } from 'react'
import { SubmissionStatusState } from 'pages/GardenAdminView'

interface GardenSynButtonParams {
  gardenName: string
  setSyncStatus: Dispatch<SetStateAction<SubmissionStatusState | undefined>>
}

const GardenSyncButton = ({
  gardenName,
  setSyncStatus,
}: GardenSynButtonParams) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [{ loading, error }, execute] = useAxios(
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
      .then(() =>
        setSyncStatus({
          result: 'success',
        }),
      )
      .catch((error) => {
        setSyncStatus({
          result: 'failure',
          msg: `${error.response.status} ${error.response.statusText}`,
        })
        console.log('ERROR', error)
      })
    setIsLoading(loading)
  }
  return error ? (
    <Button variant="contained" color="error">
      Sync Error
    </Button>
  ) : (
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
