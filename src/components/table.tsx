import React, { FC } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import Box from "@material-ui/core/Box";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props: any) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
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
        {theme.direction === "rtl" ? (
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
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "lightgrey",
    borderStyle: "solid",
  },
  container: {
    maxHeight: "75vh",
  },
});

interface TableProps {
  self: any;
  includePageNav: boolean;
  disableSearch: boolean;
}

const MyTable: FC<TableProps> = ({
  self,
  includePageNav,
  disableSearch,
}: TableProps) => {
  const classes = useStyles2();
  const page = self.state.page;
  const rowsPerPage = self.state.rowsPerPage;
  const data = self.state.data;

  const totalItems = self.state.totalItems;
  const totalItemsFiltered = self.state.totalItemsFiltered;

  //  const emptyRows = rowsPerPage - Math.min(rowsPerPage, totalItems - page * rowsPerPage);

  const handleChangePage = (event: any, newPage: number) => {
    self.state.page = newPage;
    self.updateData();
  };

  const onChange = (event: any) => {
    self.state.page = 0;
    self.searchData(event);
  };

  const onChangeEnd = (event: any) => {
    self.searchData(event, true);
  };

  const handleChangeRowsPerPage = (event: any) => {
    self.state.rowsPerPage = parseInt(event.target.value, 10);
    self.state.page = 0;
    self.updateData();
  };

  function formatTextField(self: any, index: number, disableSearch: boolean) {
    let key = self.state.tableKeys[index];
    if (!disableSearch) {
      if (self.state.tableHeads[index] === "") {
        return;
      } else if (key.includes("_at")) {
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
        );
      } else {
        return (
          <TextField
            size="small"
            id={JSON.stringify(index)}
            label=""
            variant="outlined"
            onChange={onChange}
          />
        );
      }
    }
  }

  function pageNav(
    rowsPerPage: number,
    totalItems: string,
    totalItemsFiltered: number | null,
    page: number,
    handleChangePage: any,
    handleChangeRowsPerPage: any,
    TablePaginationActions: any,
    includePageNav: boolean
  ) {
    if (includePageNav) {
      let count: any = totalItemsFiltered;
      if (totalItemsFiltered === 0 || !totalItemsFiltered) {
        count = totalItems;
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
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      );
    }
  }

  function getTableHeader(self: any) {
    if (self.state.tableHeads) {
      return (
        <TableHead>
          <TableRow>
            {self.state.tableHeads.map((tableHead: string, index: number) => (
              <TableCell
                key={tableHead}
                className={classes.tableCell}
                size="small"
              >
                {tableHead}
                <br />
                {formatTextField(self, index, disableSearch)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      );
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
          {getTableHeader(self)}
          <TableBody>
            {data.map((item: any, index: number) => (
              <TableRow
                style={
                  index % 2
                    ? { background: "whitesmoke" }
                    : { background: "white" }
                }
                key={"row" + index}
              >
                {self.state.tableKeys.map((key: string) => (
                  <TableCell
                    size="small"
                    className={classes.tableCell}
                    key={"cell" + index + key}
                  >
                    {item[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pageNav(
        rowsPerPage,
        totalItems,
        totalItemsFiltered,
        page,
        handleChangePage,
        handleChangeRowsPerPage,
        TablePaginationActions,
        includePageNav
      )}
    </Box>
  );
};
//{emptyRows > 0 && (
//            <TableRow style={{ height: 68 * emptyRows }}>
//              <TableCell className={classes.tableCell} colSpan={self.state.tableKeys.length} />
//            </TableRow>
//          )}
export default MyTable;
