import {CategoryCard} from './category-card';
import {TrendingCard} from './trending-card';
import {GlobalDataCard} from './global-data-card';

export function HighlightsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <GlobalDataCard />
      <TrendingCard />
      <CategoryCard />
    </div>
  );
}
