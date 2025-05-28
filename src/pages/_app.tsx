import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactElement) => <Layout>{page}</Layout>);

  return getLayout(<Component {...pageProps} />);
}
