import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";

// TODO: Fix typescript props (AppProps)
function MyApp({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
