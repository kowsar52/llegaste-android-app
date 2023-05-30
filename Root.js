import {StripeTerminalProvider} from '@stripe/stripe-terminal-react-native';
import App from './App';
import React, {useEffect} from 'react';
import { URL } from './src/constants';
import { getData } from './src/utils/Storage';

function Root() {



  const fetchTokenProvider = async () => {

    const response = await fetch(
        URL.stripeConnectionToken,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const {secret} = await response.json();
    console.log('secret',secret)
    return secret;
  };

  return (
    <StripeTerminalProvider
      logLevel="verbose"
      tokenProvider={fetchTokenProvider}>
        {fetchTokenProvider && <App />}
    </StripeTerminalProvider>
  );
}

export default Root;
