const CacheService = {
  getIndexLastState(key: string): { rowsPerPage: number } {
    const lastKnownState: string | null = window.localStorage.getItem(key);
    if (lastKnownState) {
      type CachedStateType = {
        rowsPerPage: number;
      };
      const parsedState: CachedStateType = JSON.parse(lastKnownState);
      if (parsedState) {
        return parsedState;
      }
    }
    return { rowsPerPage: 5 };
  },
  setItemInCache(item: unknown, key: string): void {
    window.localStorage.setItem(key, JSON.stringify(item));
  },
};

export default CacheService;
