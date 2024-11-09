import {ColumnDef} from '@tanstack/react-table';

export interface Token {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export type TokenColumn = ColumnDef<Token> & {
  accessorFn?: (row: Token) => string | number | number[] | null;
};

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_change_percentage_24h: number;
    market_cap_chart_24h: number[][];
    volume_chart_24h: number[][];
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    price_btc: number;
    coin_id: number;
    data: {
      price: number;
      price_change_percentage_24h: {
        [key: string]: number;
      };
    };
  };
}

export interface TrendingData {
  coins: TrendingCoin[];
}

export interface Category {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  content: string;
  top_3_coins: string[];
  volume_24h: number;
}

export type CategoryData = Category[];
