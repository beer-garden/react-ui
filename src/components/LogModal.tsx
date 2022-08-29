import { FileCopy, FileDownload, InsertDriveFile } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertColor,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useInstances } from 'hooks/useInstances'
import { get } from 'lodash'
import { ChangeEvent, useEffect, useState } from 'react'
import { Instance } from 'types/backend-types'

interface ILogAlert {
  type: AlertColor
  msg: string
}

interface ILogModal {
  instance: Instance
  fileHeader: string
}

const initialAlert: ILogAlert = {
  type: 'info',
  msg:
    'Plugin must be listening to the Admin Queue and logging' +
    ' to File for logs to be returned. This will only return information' +
    ' from the log file being actively written to.',
}

const LogAlert = (props: { onClose: () => void; logAlert: ILogAlert }) => {
  const { logAlert } = props
  const [showAlert, setAlert] = useState(true)
  return (
    <>
      {showAlert && (
        <Alert
          severity={logAlert.type}
          onClose={() => {
            setAlert(false)
            props.onClose()
          }}
        >
          {logAlert.msg}
        </Alert>
      )}
    </>
  )
}

const LogModal = ({ instance, fileHeader }: ILogModal) => {
  const wait = 30

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tailLines, setTailLines] = useState<number>(20)
  const [startLine, setStartLine] = useState<number>(0)
  const [endLine, setEndLine] = useState<number>(20)
  const [alerts, setAlerts] = useState<ILogAlert[]>([])
  const [displayLogs, setDisplayLogs] = useState<string>('')

  useEffect(() => {
    setAlerts([initialAlert])
  }, [])

  const { getInstanceLogs, downloadLogs } = useInstances()

  const getLogs = (id: string, start?: number, end?: number) =>
    getInstanceLogs(id, wait, start, end)
      .then((response) => {
        setDisplayLogs(response.data.toString())
        setIsLoading(false)
      })
      .catch((e) => {
        const newAlert: ILogAlert = {
          type: 'error',
          msg:
            'Something went wrong on the backend: ' +
            get(e, 'response.data.message', 'Please check the server logs'),
        }
        setAlerts([...alerts, newAlert])
        setIsLoading(false)
      })

  return (
    <>
      <Stack spacing={2}>
        {alerts?.map((logAlert: ILogAlert, index: number) => {
          return (
            <LogAlert
              onClose={() => {
                setAlerts(alerts?.splice(index, 1))
              }}
              logAlert={logAlert}
              key={`logAlert${index}`}
            />
          )
        })}
        <Stack direction="row" spacing={3}>
          <LoadingButton
            size="small"
            variant="contained"
            color="secondary"
            loadingPosition="start"
            startIcon={<FileCopy />}
            loading={isLoading}
            onClick={() => {
              setIsLoading(true)
              setDisplayLogs('')
              getLogs(instance.id, tailLines * -1)
            }}
          >
            Get Tail Logs
          </LoadingButton>
          <TextField
            value={tailLines}
            size="small"
            label="Tail Lines"
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTailLines(parseInt(event.target.value))
            }}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <LoadingButton
            size="small"
            color="secondary"
            variant="outlined"
            loadingPosition="start"
            startIcon={<InsertDriveFile />}
            loading={isLoading}
            onClick={() => {
              setIsLoading(true)
              setDisplayLogs('')
              getLogs(instance.id, startLine, endLine)
            }}
          >
            Get Line Logs
          </LoadingButton>
          <TextField
            value={startLine}
            size="small"
            label="Start Line"
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setStartLine(parseInt(event.target.value))
            }}
          />
          <TextField
            value={endLine}
            size="small"
            label="End Line"
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEndLine(parseInt(event.target.value))
            }}
          />
        </Stack>
        <LoadingButton
          color="secondary"
          variant="outlined"
          loadingPosition="start"
          startIcon={<FileDownload />}
          loading={isLoading}
          sx={{ width: 'fit-content' }}
          onClick={() =>
            downloadLogs(instance.id).then((res) => {
              const url = window.URL.createObjectURL(res.data)
              const link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.download = `${fileHeader}${instance.name}.log`
              document.body.appendChild(link)
              // Start download
              link.click()
              link.parentNode?.removeChild(link)
              window.URL.revokeObjectURL(url)
            })
          }
        >
          Download Logs
        </LoadingButton>
        {isLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          <Typography>{displayLogs}</Typography>
        )}
      </Stack>
    </>
  )
}

export default LogModal
