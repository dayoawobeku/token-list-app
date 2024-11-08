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
  };
}
