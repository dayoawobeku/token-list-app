import Image from 'next/image';
import {useQuery} from '@tanstack/react-query';
import {TriangleAlert} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';
import {TrendingData} from '@/types/token';
import {fetchTrending} from '@/services/coingecko';
import {API_CONSTANTS} from '@/utils/constants';
import CardLayout from './card-layout';

export function TrendingCard() {
  const {data, status, error} = useQuery<TrendingData>({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    refetchInterval: API_CONSTANTS.CACHE_DURATION,
  });

  const coins = data?.coins.slice(0, 3) ?? [];

  if (status === 'pending') {
    return (
      <CardLayout title="🔥 Trending">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardLayout>
    );
  }

  if (status === 'error') {
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
    return (
      <CardLayout title="🔥 Trending">
        <div className="flex items-center gap-3 h-7">
          <TriangleAlert width={20} height={20} className="stroke-red-500" />
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      </CardLayout>
    );
  }

  return (
    <CardLayout title="🔥 Trending">
      {coins.map(coin => {
        const priceChange = coin.item.data.price_change_percentage_24h.usd;
        const isPositive = priceChange >= 0;

        return (
          <div
            key={coin.item.coin_id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Image
                src={coin.item.thumb}
                alt={coin.item.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="font-medium text-sm">{coin.item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                ${coin.item.data.price.toFixed(2).toLocaleString()}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
              </span>
            </div>
          </div>
        );
      })}
    </CardLayout>
  );
}
