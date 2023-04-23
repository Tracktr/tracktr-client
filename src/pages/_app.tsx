import "../styles/globals.css";
import "../styles/nprogress.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-tooltip/dist/react-tooltip.css";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Layout from "../components/common/Layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ToastWrapper from "../components/common/ToastWrapper";
import { Analytics } from "@vercel/analytics/react";

import Router from "next/router";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeError", () => NProgress.done());
Router.events.on("routeChangeComplete", () => NProgress.done());

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools />
      <Layout>
        <Component {...pageProps} />
        <Analytics />
        <ToastWrapper />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
