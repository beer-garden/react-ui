import { Alert, AlertColor, Button, Stack, Typography } from '@mui/material'
import { ModalWrapper } from 'components/ModalWrapper'
import { Table } from 'components/Table'
import { DefaultCellRenderer } from 'components/Table/defaults'
import { NumberRangeColumnFilter } from 'components/Table/filters'
import { useInterval } from 'hooks/useInterval'
import useQueue from 'hooks/useQueue'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Column } from 'react-table'
import { Instance, Queue } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

interface IQueueAlert {
  type: AlertColor
  msg: string
}

interface IQueueModal {
  instance: Instance
}

interface QueueTableData extends ObjectWithStringKeys {
  name: string
  size: number
  action: JSX.Element
}

const QueueAlert = (props: {
  onClose: () => void
  queueAlert: IQueueAlert
}) => {
  const { queueAlert } = props
  const [showAlert, setAlert] = useState(true)
  return (
    <>
      {showAlert && (
        <Alert
          severity={queueAlert.type}
          onClose={() => {
            setAlert(false)
            props.onClose()
          }}
        >
          {queueAlert.msg}
        </Alert>
      )}
    </>
  )
}

const QueueModal = ({ instance }: IQueueModal) => {
  const [alerts, setAlerts] = useState<IQueueAlert[]>([])
  const [queueList, setQueueList] = useState<Queue[]>([])
  const [open, setOpen] = useState(false)
  const selectedQueue = useRef<string>('')

  const { getInstanceQueues, clearQueue } = useQueue()

  const getQueueList = useCallback(() => {
    getInstanceQueues(instance.id)
      .then((response) => {
        setQueueList(response.data)
      })
      .catch((e) => {
        const newAlert: IQueueAlert = {
          type: 'error',
          msg:
            'Error fetching Queue list: ' + e.response.data.message ||
            'Please check the server logs',
        }
        setAlerts((alerts) => [...alerts, newAlert])
      })
  }, [getInstanceQueues, instance.id])

  useState(() => {
    getQueueList()
  })

  useInterval(getQueueList, 10000)

  const queueData = useMemo((): QueueTableData[] => {
    return queueList.map((queue: Queue): QueueTableData => {
      return {
        name: queue.name,
        size: queue.size,
        action: (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => {
              selectedQueue.current = queue.name
              setOpen(true)
            }}
            aria-label="Clear"
          >
            Clear
          </Button>
        ),
      }
    })
  }, [queueList])

  return (
    <>
      <Stack spacing={2}>
        {alerts?.map((queueAlert: IQueueAlert, index: number) => {
          return (
            <QueueAlert
              onClose={() => {
                setAlerts(alerts?.splice(index, 1))
              }}
              queueAlert={queueAlert}
              key={`queueAlert${index}`}
            />
          )
        })}
        <Table
          tableKey="Queues"
          data={queueData}
          columns={useTableColumns()}
          maxrows={10}
          hidePagination
          hideToolbar
        />
      </Stack>
      <ModalWrapper
        open={open}
        header={`Clear ${selectedQueue.current} Queue?`}
        onClose={() => {
          selectedQueue.current = ''
          setOpen(false)
        }}
        onCancel={() => {
          selectedQueue.current = ''
          setOpen(false)
        }}
        onSubmit={() => {
          clearQueue(selectedQueue.current)
            .then((response) => {
              const newAlert: IQueueAlert = {
                type: 'success',
                msg: 'Success! Please allow 10 seconds for the message counts to update.',
              }
              setAlerts((alerts) => [...alerts, newAlert])
            })
            .catch((e) => {
              const newAlert: IQueueAlert = {
                type: 'error',
                msg:
                  'Error clearing Queue list: ' + e.response.data.message ||
                  'Please check the server logs',
              }
              setAlerts((alerts) => [...alerts, newAlert])
            })
          setOpen(false)
          selectedQueue.current = ''
        }}
        content={
          <Typography my={2}>
            All outstanding messages will be deleted. This action cannot be
            undone.
          </Typography>
        }
        styleOverrides={{ size: 'sm', top: '-55%' }}
      />
    </>
  )
}

const useTableColumns = () => {
  return useMemo<Column<QueueTableData>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        filter: 'fuzzyText',
        width: 170,
      },
      {
        Header: 'Message Size',
        Filter: NumberRangeColumnFilter,
        filter: 'between',
        accessor: 'size',
        width: 170,
      },
      {
        Header: '',
        Cell: DefaultCellRenderer,
        accessor: 'action',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 100,
      },
    ],
    [],
  )
}

export default QueueModal
