import { AlertColor, Backdrop, Button, CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useJobs } from 'hooks/useJobs'
import { DropzoneArea } from 'mui-file-dropzone'
import { JobTableData, useJobColumns } from 'pages/JobIndex'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'
import { dateFormatted } from 'utils/date-formatter'

const JobIndex = () => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const [jobs, setJobs] = useState<Job[]>([])
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const [fileList, setFileList] = useState<string[]>([])
  const [openImport, setOpenImport] = useState<boolean>(false)

  const { getJobs, importJobs, exportJobs } = useJobs()
  const navigate = useNavigate()

  const [errorFetch, setErrorFetch] = useState<AxiosError>()

  const errorHandler = (e: string) => {
    setAlert({
      severity: 'error',
      message: e,
      doNotAutoDismiss: true,
    })
  }

  const fetchJobs = () => {
    getJobs()
      .then((response) => {
        setJobs(response.data)
      })
      .catch((e) => {
        setErrorFetch(e)
      })
  }

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // temporary for demo
  const createRequestOnClick = () => {
    navigate('/jobs/create')
  }

  const handleImport = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = reader.result
        try {
          JSON.parse(result as string)
          setFileList((fileData) => [...fileData, result as string])
        } catch (e) {
          setAlert({
            severity: 'error',
            message: `${file.name} is not JSON parsable - please remove and choose a different file`,
            doNotAutoDismiss: true,
            showSeverity: false,
          })
        }
      }
      reader.readAsText(file)
    })
  }

  const handleExport = () => {
    exportJobs()
      .then((response) => {
        const filename = `JobExport_${new Date(Date.now()).toISOString()}.json`
        const blob = new Blob([JSON.stringify(response.data)], {
          type: 'application/json;charset=utf-8',
        })
        const url = window.URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.style.display = 'none'
        downloadLink.href = url
        downloadLink.setAttribute('download', filename)
        document.body.appendChild(downloadLink)
        downloadLink.click()
        downloadLink.parentNode?.removeChild(downloadLink)
        window.URL.revokeObjectURL(url)
      })
      .catch((e) => errorHandler(e))
  }

  const jobData = useMemo((): JobTableData[] => {
    return jobs.map((job: Job): JobTableData => {
      return {
        name: job.name,
        status: job.status || '',
        system: job.request_template.system,
        instance: job.request_template.instance_name,
        command: job.request_template.command,
        nextRun: job.next_run_time
          ? dateFormatted(new Date(job.next_run_time))
          : '',
        success: job.success_count || 0,
        error: job.error_count || 0,
        nameLink: `/jobs/${job.id}`,
        systemLink: `/systems/${job.request_template.namespace}/${job.request_template.system}/${job.request_template.system_version}`,
      }
    })
  }, [jobs])

  const jobColumns = useJobColumns()

  return !errorFetch ? (
    <>
      <PageHeader title="Request Scheduler" description="" />
      <Divider />
      <Table tableKey="JobIndex" data={jobData} columns={jobColumns}>
        {hasPermission('job:create') && (
          <Button
            variant="contained"
            color="primary"
            aria-label="Create Job"
            onClick={createRequestOnClick}
          >
            Create
          </Button>
        )}
        {hasPermission('job:create') && (
          <Button
            variant="contained"
            color="primary"
            aria-label="Import Jobs"
            onClick={() => setOpenImport(true)}
          >
            IMPORT
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          aria-label="Export Jobs"
          onClick={handleExport}
        >
          EXPORT
        </Button>
      </Table>
      <ModalWrapper
        open={openImport}
        header="Import Jobs"
        onClose={() => {
          setOpenImport(false)
        }}
        onCancel={() => {
          setOpenImport(false)
        }}
        onSubmit={() => {
          fileList.forEach((fileData) => {
            importJobs(fileData)
              .then(() => {
                setAlert({
                  severity: 'success',
                  message: 'File(s) imported',
                })
                fetchJobs()
                setOpenImport(false)
              })
              .catch((e) => errorHandler(e))
          })
        }}
        styleOverrides={{ size: 'sm', top: '-55%' }}
        content={
          <DropzoneArea
            fileObjects={fileList}
            useChipsForPreview
            acceptedFiles={['text/plain', 'application/json']}
            showAlerts={false}
            onAlert={(message: string, variant: AlertColor) => {
              setAlert({
                severity: variant,
                message,
              })
            }}
            onChange={handleImport}
          />
        }
      />
      {alert ? <Snackbar status={alert} /> : null}
    </>
  ) : errorFetch.response ? (
    <ErrorAlert
      statusCode={errorFetch.response?.status}
      errorMsg={errorFetch.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="Job data loading" />
    </Backdrop>
  )
}

export { JobIndex }
