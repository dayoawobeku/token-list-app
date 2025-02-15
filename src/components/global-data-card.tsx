import Image from 'next/image';
import {useQuery} from '@tanstack/react-query';
import {TriangleAlert} from 'lucide-react';
import {Card, CardContent} from '@/components/ui/card';
import {API_CONSTANTS} from '@/utils/constants';
import {fetchGlobalData} from '@/services/coingecko';
import {Skeleton} from '@/components/ui/skeleton';
import {GlobalData} from '@/types/token';
import {getPercentageChange} from '@/helpers';

const SkeletonCard = ({title}: {title: string}) => (
  <Card>
    <CardContent className="py-3.5 space-y-2">
      <Skeleton className="h-7 w-3/4" />
      <p className="text-sm font-semibold text-neutral-600">{title}</p>
    </CardContent>
  </Card>
);

const ErrorCard = ({message, title}: {message: string; title: string}) => (
  <Card>
    <CardContent className="py-3.5 space-y-2">
      <div className="flex items-center gap-3 h-7">
        <TriangleAlert width={20} height={20} className="stroke-red-500" />
        <p className="text-sm text-red-500">{message}</p>
      </div>
      <p className="text-sm font-semibold text-neutral-600">{title}</p>
    </CardContent>
  </Card>
);

export function GlobalDataCard() {
  const {data, status, error} = useQuery<GlobalData>({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: API_CONSTANTS.CACHE_DURATION,
  });

  if (status === 'pending') {
    return (
      <div className="flex flex-col gap-3 justify-between">
        <SkeletonCard title="Market Cap" />
        <SkeletonCard title="24h Trading Volume" />
      </div>
    );
  }

  if (status === 'error') {
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
    return (
      <div className="flex flex-col gap-3 justify-between">
        <ErrorCard message={errorMessage} title="Market Cap" />
        <ErrorCard message={errorMessage} title="24h Trading Volume" />
      </div>
    );
  }

  const {data: marketData} = data;

  const {color: marketCapPercentageColor, arrow} = getPercentageChange(
    marketData.market_cap_change_percentage_24h_usd,
  );

  const marketCapPercentage24h =
    marketData.market_cap_change_percentage_24h_usd;

  return (
    <div className="flex flex-col gap-3 justify-between">
      <Card>
        <CardContent className="py-3.5 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-lg font-bold">
              ${marketData.total_market_cap.usd.toLocaleString()}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <p className="font-semibold text-neutral-600">Market Cap</p>
              <p className={`font-semibold ${marketCapPercentageColor}`}>
                {arrow}
                {Math.abs(marketCapPercentage24h).toFixed(1)}%
              </p>
            </div>
          </div>
          <Image
            alt="chart"
            src="https://www.coingecko.com/total_market_cap.svg"
            width={157}
            height={58}
            className="hidden xl:block"
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-3.5 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-lg font-bold">
              ${marketData.total_volume.usd.toLocaleString()}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <p className="font-semibold text-neutral-600">
                24h Trading Volume
              </p>
            </div>
          </div>

          <Image
            alt="chart"
            src="https://www.coingecko.com/total_volume.svg"
            width={157}
            height={58}
            className="hidden xl:block"
          />
        </CardContent>
      </Card>
    </div>
  );
}
