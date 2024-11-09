import localFont from 'next/font/local';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {HighlightsSection} from '@/components/highlights';
import {TokenTable} from '@/components/token-table';
import {useState} from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const queryClient = new QueryClient();

export default function Home() {
  const [activeView, setActiveView] = useState('Trending');

  return (
    <QueryClientProvider client={queryClient}>
      <main
        className={`${geistSans.variable} ${geistMono.variable} xl:container mx-auto px-4 py-8 font-[family-name:var(--font-geist-sans)]`}
      >
        <h1 className="text-3xl font-bold mb-8">
          Cryptocurrency Prices by Market Cap
        </h1>
        <HighlightsSection />
        <div className="mt-8">
          <TokenTable activeView={activeView} setActiveView={setActiveView} />
        </div>
      </main>
    </QueryClientProvider>
  );
}
