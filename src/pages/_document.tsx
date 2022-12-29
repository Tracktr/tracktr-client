import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Track the best movies and shows." />
      </Head>
      <body className="text-white bg-primaryBackground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
