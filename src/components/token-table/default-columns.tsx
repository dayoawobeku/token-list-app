import Image from 'next/image';
import {ResponsiveLine} from '@nivo/line';
import {Token, TokenColumnWithStringId} from '@/types/token';
import {getPercentageChange} from '@/helpers';

export const defaultColumns: TokenColumnWithStringId[] = [
  {
    id: 'index',
    header: '#',
    cell: ({row}) => row.index + 1,
    enableSorting: false,
  },
  {
    id: 'name',
    header: 'Coin',
    accessorFn: (row: Token) => row.name,
    cell: ({row}) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.image}
          alt={`${row.original.name} logo`}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>{row.original.name}</span>
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      rowA.original.name.localeCompare(rowB.original.name),
  },
  {
    id: 'current_price',
    header: 'Price',
    accessorFn: (row: Token) => row.current_price,
    cell: ({row}) => `$${row.original.current_price.toLocaleString()}`,
  },
  {
    id: 'price_change_percentage_1h_in_currency',
    header: '1h',
    accessorFn: (row: Token) => row.price_change_percentage_1h_in_currency,
    cell: ({row}) => {
      const value = row.original.price_change_percentage_1h_in_currency;
      if (value === undefined) return null;
      const {color, arrow} = getPercentageChange(value);
      return (
        <span className={`text-sm font-semibold ${color}`}>
          {arrow} {Math.abs(value).toFixed(2)}%
        </span>
      );
    },
  },
  {
    id: 'price_change_percentage_24h_in_currency',
    header: '24h',
    accessorFn: (row: Token) => row.price_change_percentage_24h_in_currency,
    cell: ({row}) => {
      const value = row.original.price_change_percentage_24h_in_currency;
      if (value === undefined) return null;
      const {color, arrow} = getPercentageChange(value);
      return (
        <span className={`text-sm font-semibold ${color}`}>
          {arrow} {Math.abs(value).toFixed(2)}%
        </span>
      );
    },
  },
  {
    id: 'price_change_percentage_7d_in_currency',
    header: '7d',
    accessorFn: (row: Token) => row.price_change_percentage_7d_in_currency,
    cell: ({row}) => {
      const value = row.original.price_change_percentage_7d_in_currency;
      if (value === undefined) return null;
      const {color, arrow} = getPercentageChange(value);
      return (
        <span className={`text-sm font-semibold ${color}`}>
          {arrow} {Math.abs(value).toFixed(2)}%
        </span>
      );
    },
  },
  {
    id: 'total_volume',
    header: '24h Volume',
    accessorFn: (row: Token) => row.total_volume,
    cell: ({row}) => `$${row.original.total_volume.toLocaleString()}`,
  },
  {
    id: 'market_cap',
    header: 'Market Cap',
    accessorFn: (row: Token) => row.market_cap,
    cell: ({row}) => `$${row.original.market_cap.toLocaleString()}`,
  },
  {
    id: 'sparkline',
    header: 'Last 7 Days',
    cell: ({row}) => (
      <div className="w-[120px] h-10">
        <ResponsiveLine
          data={[
            {
              id: 'sparkline',
              data: row.original.sparkline_in_7d.price.map((price, index) => ({
                x: index,
                y: price,
              })),
            },
          ]}
          margin={{top: 5, right: 5, bottom: 5, left: 5}}
          xScale={{type: 'point'}}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          enableGridX={false}
          enableGridY={false}
          enablePoints={false}
          areaOpacity={0.1}
          useMesh={true}
          colors={['#22c55e']}
        />
      </div>
    ),
    enableSorting: false,
  },
];
