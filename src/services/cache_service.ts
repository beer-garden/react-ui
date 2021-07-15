const CacheService = {
  getIndexLastState(key: string) {
    let lastKnownState: string | null = window.localStorage.getItem(key);
    if (lastKnownState) {
      type CachedStateType = {
        rowsPerPage: number;
      };
      let parsedState: CachedStateType = JSON.parse(lastKnownState);
      if (parsedState) {
        return parsedState;
      }
    }
    return { rowsPerPage: 5 };
  },
  setItemInCache(item: object, key: string) {
    window.localStorage.setItem(key, JSON.stringify(item));
  },
};

export default CacheService;
