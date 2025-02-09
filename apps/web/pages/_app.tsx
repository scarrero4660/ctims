import './styles.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from "../components/Layout";
import { Provider } from 'react-redux'
import {store} from "../store/store";
import {SessionProvider} from "next-auth/react";

function CustomApp({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  const AnyComponent = Component as any;
  return (
    <Layout>
      <Head>
        <title>CTIMS</title>
      </Head>
      <main className="app">
        <SessionProvider session={session}>
        <Provider store={store}>
          <AnyComponent {...pageProps} />
        </Provider>
        </SessionProvider>
      </main>
    </Layout>
  );
}

export default CustomApp;
