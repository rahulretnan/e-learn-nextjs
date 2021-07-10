import 'antd/dist/antd.css';
import type { AppProps } from 'next/app';
import AppLayout from '~/layouts';
import GraphQlProvider from '~/services/urqlClient';
import '~/styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GraphQlProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </GraphQlProvider>
  );
}
export default MyApp;
