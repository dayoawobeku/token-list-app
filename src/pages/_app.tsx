import type {AppProps} from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>Crypto Token List | Track and Analyze Cryptocurrencies</title>
        <meta
          name="description"
          content="Stay updated with real-time cryptocurrency data. Track prices, market caps, and trends for top tokens in the crypto market."
        />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}
