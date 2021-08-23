import { Request } from "../custom_types/custom_types";

type CachedStates = {
  rowsPerPage?: number;
  request?: Request;
  requestQueue?: Request[];
  namespacesSelected?: string[];
};

function getItem(key: string): CachedStates {
  const lastKnownState: string | null = window.localStorage.getItem(key);
  let parsedState: CachedStates = {};
  if (lastKnownState) {
    parsedState = JSON.parse(lastKnownState);
  }
  return parsedState;
}

const CacheService = {
  getIndexLastState(key: string): { rowsPerPage: number } {
    const item = getItem(key);
    return { rowsPerPage: item.rowsPerPage || 5 };
  },

  getNamespacesSelected(
    key: string,
    defaultValue: string[] = []
  ): { namespacesSelected: string[] } {
    const item = getItem(key);
    return {
      namespacesSelected: item.namespacesSelected || defaultValue,
    };
  },

  popQueue(key: string): Request | undefined | void {
    const requestQueue = getItem(key).requestQueue;
    if (requestQueue) {
      const request = requestQueue.pop();
      this.setItemInCache({ requestQueue: requestQueue }, key);
      return request;
    }
  },

  pushQueue(item: Request, key: string): void {
    const requestQueue: Request[] = getItem(key).requestQueue || [];
    if (requestQueue) {
      requestQueue.push(item);
      this.setItemInCache({ requestQueue: requestQueue }, key);
    }
  },

  setItemInCache(item: unknown, key: string): void {
    window.localStorage.setItem(key, JSON.stringify(item));
  },
};

export default CacheService;
