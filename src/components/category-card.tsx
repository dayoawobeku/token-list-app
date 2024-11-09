import {useQuery} from '@tanstack/react-query';
import {TriangleAlert} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';
import {fetchCategories} from '@/services/coingecko';
import {CategoryData} from '@/types/token';
import {API_CONSTANTS} from '@/utils/constants';
import {CardLayout} from './card-layout';

export function CategoryCard() {
  const {data, status, error} = useQuery<CategoryData>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    refetchInterval: API_CONSTANTS.CACHE_DURATION,
  });

  const categories = data?.slice(0, 3) ?? [];

  if (status === 'pending') {
    return (
      <CardLayout title="📊 Top Categories">
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
      <CardLayout title="📊 Top Categories">
        <div className="flex items-center gap-3 h-7">
          <TriangleAlert width={20} height={20} className="stroke-red-500" />
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      </CardLayout>
    );
  }

  return (
    <CardLayout title="📊 Top Categories">
      {categories.map(category => (
        <div key={category.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{category.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                category.market_cap_change_24h >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {category.market_cap_change_24h >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(category.market_cap_change_24h).toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </CardLayout>
  );
}
