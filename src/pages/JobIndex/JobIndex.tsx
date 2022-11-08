import { Button } from '@mui/material'
import { Divider } from 'components/Divider'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useJobs } from 'hooks/useJobs'
import { DropzoneArea } from 'material-ui-dropzone'
import { getFormattedTable } from 'pages/JobIndex/jobIndexHelpers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const JobIndex = () => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const [jobs, setJobs] = useState<Job[]>([])
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const [file, setFile] = useState<string[]>([])
  const [openImport, setOpenImport] = useState<boolean>(false)

  const { getJobs, importJobs, exportJobs } = useJobs()
  const navigate = useNavigate()

  const errorHandler = (e: string) => {
    setAlert({
      severity: 'error',
      message: e,
      doNotAutoDismiss: true,
    })
  }

  const fetchJobs = () => {
    getJobs()
      .then((response) => setJobs(response.data))
      .catch((e) => errorHandler(e))
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
          setFile((fileData) => [...fileData, result as string])
        } catch (e) {
          errorHandler('Please upload JSON parsable file(s)')
        }
      }
      reader.readAsText(file)
    })
  }

  const handleExport = () => {
    exportJobs()
      .then((response) => {
        const filename = 'JobExport_' + new Date(Date.now()).toISOString()
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

  return (
    <>
      <PageHeader title="Request Scheduler" description="" />
      <Divider />
      <Button onClick={createRequestOnClick}>Create</Button>
      {hasPermission('job:create') && (
        <Button onClick={() => setOpenImport(true)}>IMPORT</Button>
      )}
      <Button onClick={handleExport}>EXPORT</Button>
      {getFormattedTable(jobs)}
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
          file.forEach((fileData) => {
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
          <>
            <DropzoneArea useChipsForPreview onChange={handleImport} />
          </>
        }
      />
      {alert ? <Snackbar status={alert} /> : null}
    </>
  )
}

export { JobIndex }
