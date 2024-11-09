export const getPercentageChange = (value: number) => {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-green-500' : 'text-red-500';
  const arrow = isPositive ? '↑' : '↓';
  return {color, arrow};
};
