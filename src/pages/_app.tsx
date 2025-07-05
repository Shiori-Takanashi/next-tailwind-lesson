import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import Layout from "@/components/Layout";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // ページコンポーネントで noLayout を指定していればレイアウトをスキップ
  const noLayout = (Component as any).noLayout;
  const getLayout = noLayout
    ? ((page: ReactElement) => page)
    : (Component.getLayout || ((page: ReactElement) => <Layout>{page}</Layout>));

  return getLayout(<Component {...pageProps} />);
}
