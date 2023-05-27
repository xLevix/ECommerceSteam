import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core';
import {Layout} from "@/components/Layout";
import { SteamProfile } from "@/lib/passport";

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
                <Component {...pageProps} />
            </Layout>
        </MantineProvider>
    )
}
