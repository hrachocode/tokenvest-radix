import { RdtProvider } from '@/rdt/RdtProvider';
import '@/styles/globals.css'
import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "radix-connect-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

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
        <div style={{
        width:"100%",
        display:"flex",
        justifyContent:"center"
      }}>
        <radix-connect-button></radix-connect-button>
      </div>
        <Component {...pageProps} />
      </RdtProvider>
    )
  } else {
    return (<></>)
  }
}
