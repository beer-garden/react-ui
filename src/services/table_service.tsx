import CacheService from "./cache_service";

class TableService {
  updateData(self: any, data: any[], length: number, cacheKey: string = "") {
    let newData: any[] = data.slice(
      self.state.page * self.state.rowsPerPage,
      self.state.page * self.state.rowsPerPage + self.state.rowsPerPage
    );
    newData = self.formatData(newData, self.state.tableKeys);
    self.setState({ data: newData, totalItems: length });
    if (cacheKey !== "") {
      CacheService.setItemInCache(
        {
          rowsPerPage: self.state.rowsPerPage,
        },
        cacheKey
      );
    }
  }
}

const item = new TableService();

export default item;
