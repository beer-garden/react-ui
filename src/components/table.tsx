import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AxiosResponse } from 'axios'
import PropTypes from 'prop-types'
import { BaseSyntheticEvent, useState } from 'react'
import CacheService from 'services/cache_service'
import { TableInterface } from 'types/custom-types'

const tableCellStyle = {
  borderWidth: 0.5,
  borderColor: 'lightgrey',
  borderStyle: 'solid',
}

function TablePaginationActions(props: {
  count: number
  page: number
  rowsPerPage: number
  onPageChange(event: BaseSyntheticEvent | null, value: number): void
}) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event: BaseSyntheticEvent) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: BaseSyntheticEvent) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: BaseSyntheticEvent) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: BaseSyntheticEvent) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div
      style={{
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
      }}
    >
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
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

const MyTable = ({ parentState }: TableInterface) => {
  console.log('TABLE HERE thx')
  let cachedState: { rowsPerPage: number } = { rowsPerPage: 5 }

  if (parentState.cacheKey) {
    const newCachedState = CacheService.getIndexLastState(parentState.cacheKey)

    if (
      'rowsPerPage' in newCachedState &&
      typeof newCachedState['rowsPerPage'] === 'string'
    ) {
      newCachedState['rowsPerPage'] = parseInt(newCachedState['rowsPerPage'])
    }
    cachedState = newCachedState
  }

  const [data, setData] = useState<(string | JSX.Element | number | null)[][]>(
    [],
  )
  const [completeDataSet, setCompleteDataSet] = useState(
    parentState.completeDataSet,
  )
  const [isLoading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    cachedState.rowsPerPage,
  )
  const [totalItemsFiltered, setTotalItemsFiltered] = useState('0')
  const [totalItems, setTotalItems] = useState('0')
  const [includeChildren, setIncludeChildren] = useState(
    parentState.includeChildren,
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
        parentState.cacheKey,
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
      // Can't use getRowPageOptions here as can't call useEffect
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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
              <TableCell key={tableHead} sx={tableCellStyle} size="small">
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
      setLoading(false)
    } else {
      if (parentState.completeDataSet && parentState.formatData) {
        setLoading(false)
        setData(
          parentState.formatData(
            parentState.completeDataSet.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage,
            ),
          ),
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
      <TableContainer sx={{ maxHeight: '75vh' }}>
        <Table
          stickyHeader
          sx={{ minWidth: 500 }}
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
                    sx={tableCellStyle}
                    key={'cell' + index + itemIndex}
                  >
                    {typeof item === 'string' || typeof item === 'number' ? (
                      <Paper elevation={0}>
                        <Typography variant="body1">{item}</Typography>
                      </Paper>
                    ) : (
                      item
                    )}
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
