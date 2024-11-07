import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchGlobalData = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/global");
  return response.json();
};

export function HighlightsSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["globalData"],
    queryFn: fetchGlobalData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const { data: globalData } = data;

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
