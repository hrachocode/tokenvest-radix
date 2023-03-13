import '@/styles/globals.css';
import { RdtProvider } from '@/rdt/RdtProvider';
import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import Header from '@/components/Header/Header';
import { Box } from '@mui/material';
import { styles } from '@/styles/App.styles';


export default function App({ Component, pageProps }: AppProps) {

  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  if (isMounted) {
    return (
      <RdtProvider
        value={RadixDappToolkit(
          {
            dAppName: "Radix dApp",
            dAppDefinitionAddress:
              "account_tdx_b_1pzv5m8xqy39jmjkk60jluwhrctcs4qpafrxs7rr54jwq0899y3",
          },
          (requestData) => {
            requestData({
              accounts: { quantifier: "atLeast", quantity: 1 },
            });
          },
          {
            networkId: 0X0b,
          }
        )}
      >
        <Header />
        <Box sx={styles.mainWrapper}>
          <Component {...pageProps} />
        </Box>
      </RdtProvider>
    )
  } else {
    return (<></>)
  }
}
