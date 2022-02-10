import React, { BaseSyntheticEvent, FC, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import Box from '@material-ui/core/Box'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import TableHead from '@material-ui/core/TableHead'
import TextField from '@material-ui/core/TextField'
import { TableInterface } from '../custom_types/custom_types'
import { AxiosResponse } from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import CacheService from '../services/cache_service'

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

function TablePaginationActions(props: {
  count: number
  page: number
  rowsPerPage: number
  onChangePage(event: BaseSyntheticEvent | null, value: number): void
}) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = (event: BaseSyntheticEvent) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event: BaseSyntheticEvent) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event: BaseSyntheticEvent) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event: BaseSyntheticEvent) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    borderStyle: 'solid',
  },
  container: {
    maxHeight: '75vh',
  },
})

const MyTable: FC<TableInterface> = ({ parentState }: TableInterface) => {
  let cachedState: { rowsPerPage: number } = { rowsPerPage: 5 }
  if (parentState.cacheKey) {
    cachedState = CacheService.getIndexLastState(parentState.cacheKey)
  }
  const [data, setData] = useState<(string | JSX.Element | number | null)[][]>(
    []
  )
  const [completeDataSet, setCompleteDataSet] = useState(
    parentState.completeDataSet
  )
  const [isLoading, setLoading] = useState(true)
  const classes = useStyles2()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(cachedState.rowsPerPage)
  const [totalItemsFiltered, setTotalItemsFiltered] = useState('0')
  const [totalItems, setTotalItems] = useState('0')
  const [includeChildren, setIncludeChildren] = useState(
    parentState.includeChildren
  )

  function handleChangePage(event: BaseSyntheticEvent | null, newPage: number) {
    if (parentState.setSearchApi) {
      parentState.setSearchApi('' + newPage * rowsPerPage, 'start')
    }
    setPage(newPage)
    setLoading(true)
  }

  const onChange = (event: BaseSyntheticEvent) => {
    if (parentState.setSearchApi) {
      parentState.setSearchApi(event.target.value, event.target.id)
    }
    setPage(0)
    setLoading(true)
  }

  const onChangeEnd = (event: BaseSyntheticEvent) => {
    if (parentState.setSearchApi) {
      parentState.setSearchApi(event.target.value, event.target.id, true)
    }
    setPage(0)
    setLoading(true)
  }

  const handleChangeRowsPerPage = (event: BaseSyntheticEvent) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
    if (parentState.setSearchApi) {
      parentState.setSearchApi('0', 'start')
    }
    setLoading(true)
    if (parentState.cacheKey) {
      CacheService.setItemInCache(
        {
          rowsPerPage: event.target.value,
        },
        parentState.cacheKey
      )
    }
  }

  function formatTextField(index: number) {
    if (!parentState.disableSearch) {
      if (parentState.tableHeads[index] === '') {
        return
      } else if (['Created'].includes(parentState.tableHeads[index])) {
        return (
          <Box display="flex" alignItems="flex-start">
            <Box width={1 / 2}>
              <TextField
                style={{ width: 220 }}
                size="small"
                id={JSON.stringify(index)}
                label="Start"
                type="datetime-local"
                defaultValue=""
                onChange={onChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth={false}
              />
            </Box>
            <Box pl={1} width={1 / 2}>
              <TextField
                size="small"
                id={JSON.stringify(index)}
                label="End"
                key="End"
                type="datetime-local"
                defaultValue=""
                onChange={onChangeEnd}
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: 220 }}
                fullWidth={false}
              />
            </Box>
          </Box>
        )
      } else {
        return (
          <TextField
            size="small"
            id={JSON.stringify(index)}
            label=""
            variant="outlined"
            onChange={onChange}
          />
        )
      }
    }
  }

  function pageNav() {
    if (parentState.includePageNav) {
      let count: string = totalItemsFiltered
      if (totalItemsFiltered === '0' || !totalItemsFiltered) {
        count = totalItems
      }
      return (
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                colSpan={3}
                count={parseInt(count)}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )
    }
  }

  function getTableHeader() {
    if (parentState.tableHeads) {
      return (
        <TableHead>
          <TableRow>
            {parentState.tableHeads.map((tableHead: string, index: number) => (
              <TableCell
                key={tableHead}
                className={classes.tableCell}
                size="small"
              >
                {tableHead}
                <br />
                {formatTextField(index)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )
    }
  }

  function updateData() {
    if (!isLoading) {
      setLoading(true)
    }
    if (parentState.apiDataCall) {
      if (parentState.setSearchApi) {
        parentState.setSearchApi('' + rowsPerPage, 'length')
      }
      parentState.apiDataCall(page, rowsPerPage, successCallback)
    } else {
      if (parentState.completeDataSet && parentState.formatData) {
        setLoading(false)
        setData(
          parentState.formatData(
            parentState.completeDataSet.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
          )
        )
        setTotalItems('' + parentState.completeDataSet.length)
      } else if (parentState.formatData) {
        setLoading(false)
        setData(parentState.formatData())
      }
    }
  }

  function successCallback(response: AxiosResponse) {
    setLoading(false)
    if (parentState.formatData) {
      setData(parentState.formatData(response.data))
    }
    setTotalItems(response.headers.recordstotal)
    setTotalItemsFiltered(response.headers.recordsfiltered)
  }

  if (
    isLoading ||
    parentState.includeChildren !== includeChildren ||
    parentState.completeDataSet !== completeDataSet
  ) {
    if (parentState.includeChildren !== includeChildren) {
      setIncludeChildren(parentState.includeChildren)
      setPage(0)
    }
    if (parentState.completeDataSet) {
      setCompleteDataSet(parentState.completeDataSet)
    }
    updateData()
  }

  function getCircularProgress() {
    if (isLoading) {
      return <CircularProgress size={25} color="inherit" />
    }
  }

  return (
    <Box>
      <TableContainer className={classes.container}>
        <Table
          stickyHeader
          className={classes.table}
          aria-label="custom pagination table"
        >
          {getTableHeader()}
          <TableBody>
            {data.map((items, index: number) => (
              <TableRow
                style={
                  index % 2
                    ? { background: 'whitesmoke' }
                    : { background: 'white' }
                }
                key={'row' + index}
              >
                {items.map((item, itemIndex: number) => (
                  <TableCell
                    size="small"
                    className={classes.tableCell}
                    key={'cell' + index + itemIndex}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        alignItems="center"
        justifyContent="flex-end"
        display="flex"
        flexDirection="row"
      >
        <Box>{getCircularProgress()}</Box>
        <Box>{pageNav()}</Box>
      </Box>
    </Box>
  )
}
export default MyTable
