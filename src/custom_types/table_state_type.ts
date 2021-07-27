type TableStateType = {
  data: any[];
  page: number;
  rowsPerPage: number;
  totalItems: number | null;
  totalItemsFiltered: number;
  search: string;
  tableKeys: string[];
  tableHeads: string[];
};
export default TableStateType;
