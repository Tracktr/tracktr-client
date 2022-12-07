// src/pages/_app.tsx
import "../styles/globals.css";
import "../styles/nprogress.css";
import "react-toastify/dist/ReactToastify.min.css";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Layout from "../components/common/Layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ToastWrapper from "../components/common/ToastWrapper";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools />
      <Layout>
        <Component {...pageProps} />
        <ToastWrapper />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
