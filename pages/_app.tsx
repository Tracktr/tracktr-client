import type { DehydratedState } from "react-query";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import "../styles/nprogress.css";

import { useState } from "react";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Router from "next/router";
import NProgress from "nprogress";

import Layout from "@/components/common/Layout";
import Head from "next/head";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeError", () => NProgress.done());
Router.events.on("routeChangeComplete", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState; session: Session }>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Head>
              <meta name="theme-color" content="#101010" />
            </Head>
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
