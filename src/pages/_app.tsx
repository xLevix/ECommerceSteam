import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core';
import {Layout} from "@/components/Layout";
import { SteamProfile } from "@/lib/passport";
import Head from 'next/head'

interface MyAppProps extends AppProps {
    pageProps: {
        user: SteamProfile | null;
    };
}

export default function App({ Component, pageProps }: MyAppProps) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'light',
            }}
        >
            <Layout user={pageProps.user}>
                <Head>
                    <title>Stronka</title>
                    <link rel="preconnect" href="https://app.snipcart.com"/>
                    <link rel="preconnect" href="https://cdn.snipcart.com"/>
                    <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css"/>
                </Head>
                <Component {...pageProps} />
                <script async src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js"></script>
                <div hidden id="snipcart" data-api-key="MjAxNDQwNDItNjE5ZS00MzFlLWFmNWYtZWVlMDlkNGNhMTYyNjM4MjE5NDQ4NTQ3Nzc2NDYy" data-currency="pln"></div>
            </Layout>
        </MantineProvider>
    )
}
