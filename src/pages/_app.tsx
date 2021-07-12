import 'antd/dist/antd.css';
import axios from 'axios';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import nookies from 'nookies';
import AppContextProvider from '~/contexts';
import AppLayout from '~/layouts';
import GraphQlProvider from '~/services/urqlClient';
import { TAuthInitialValues } from '~/shared/types';
import '~/styles/global.css';

type TUserProps = AppProps & {
  userData: TAuthInitialValues;
};

function MyApp({ Component, pageProps, userData }: TUserProps) {
  return (
    <GraphQlProvider>
      <AppContextProvider userData={userData}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AppContextProvider>
    </GraphQlProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;
  const appProps = await App.getInitialProps(appContext);
  if (typeof window === 'undefined') {
    const { token } = nookies.get(ctx);
    if (token) {
      try {
        const result = await axios.post('/api/validate', {
          token,
        });
        return { userData: result, ...appProps };
      } catch (e) {
        console.log(e);
      }
    } else {
      if (ctx.res && !ctx.pathname.includes('signin')) {
        ctx.res?.writeHead(302, { Location: '/signin' });
        ctx.res.end();
      }
    }
  }
  return { ...appProps };
};

export default MyApp;
