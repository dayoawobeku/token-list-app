import {GlobalData, Token} from '@/types/token';
import {API_CONSTANTS} from '@/utils/constants';

let cachedTokens: Token[] | null = null;
let cachedGlobalData: GlobalData | null = null;
let lastTokensFetchTime = 0;
let lastGlobalDataFetchTime = 0;

export const fetchTokens = async (): Promise<Token[]> => {
  const now = Date.now();
  if (
    cachedTokens &&
    now - lastTokensFetchTime < API_CONSTANTS.CACHE_DURATION
  ) {
    return cachedTokens;
  }

  const response = await fetch(
    `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.COINS_MARKETS}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true`,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  cachedTokens = data;
  lastTokensFetchTime = now;
  return data;
};

export const fetchGlobalData = async (): Promise<GlobalData> => {
  const now = Date.now();
  if (
    cachedGlobalData &&
    now - lastGlobalDataFetchTime < API_CONSTANTS.CACHE_DURATION
  ) {
    return cachedGlobalData;
  }

  const response = await fetch(`${API_CONSTANTS.BASE_URL}/global`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  cachedGlobalData = data;
  lastGlobalDataFetchTime = now;
  return data;
};
