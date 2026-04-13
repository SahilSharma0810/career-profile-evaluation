import { nanoquery } from '@nanostores/query';
import { fetchUpcomingMasterclassCards } from '../api/upcomingMasterclasses';

export const [createUpcomingMcFetcherStore] = nanoquery({
  fetcher: async (_namespace, programKey, limitKey) => {
    const limit = Number(limitKey) || 3;
    return fetchUpcomingMasterclassCards(String(programKey), limit);
  },
  onError: (error) => {
    console.error('Upcoming masterclasses fetch error:', error);
  },
  dedupeTime: 2 * 60 * 1000,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateInterval: 0,
  onErrorRetry: null
});

export const createUpcomingMasterclassesStore = (programKey, limit = 3) =>
  createUpcomingMcFetcherStore(['upcoming_mc', programKey, limit]);
