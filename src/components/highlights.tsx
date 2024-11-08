import {useQuery} from '@tanstack/react-query';
import {Loader} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {API_CONSTANTS} from '@/utils/constants';
import {fetchGlobalData} from '@/services/coingecko';

export function HighlightsSection() {
  const {data, status, error} = useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: API_CONSTANTS.CACHE_DURATION,
  });

  if (status === 'pending') return <Loader className="animate-spin" />;

  if (status === 'error') {
    if (error.message.includes('429')) {
      return (
        <div>
          We&apos;re currently experiencing high demand. Please try again in a
          few minutes.
        </div>
      );
    }
    return <div>Error fetching data. Please try again later.</div>;
  }

  const {data: globalData} = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {globalData.active_cryptocurrencies.toLocaleString()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Market Cap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${globalData.total_market_cap.usd.toLocaleString()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>24h Trading Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${globalData.total_volume.usd.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
