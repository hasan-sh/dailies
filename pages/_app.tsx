import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="application-name" content="Dailies" />
        <meta name="description" content="Create your Dailies, stay aligned with your life!" />
        <meta name="keywords" content="journals,dailies,personal deveoplment" />

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
    </Head>
      <Component {...pageProps} />
    </>
  )
}

        // <Head>
        //     <meta name="application-name" content="Dailies" />
        //     <meta name="apple-mobile-web-app-capable" content="yes" />
        //     <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        //     <meta name="apple-mobile-web-app-title" content="Dailies" />
        //     <meta name="description" content="Create your Dailies, stay aligned with your life!" />
        //     <meta name="format-detection" content="telephone=no" />
        //     <meta name="mobile-web-app-capable" content="yes" />
        //     <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        //     <meta name="msapplication-TileColor" content="#2B5797" />
        //     <meta name="msapplication-tap-highlight" content="no" />
        //     <meta name="theme-color" content="#000000" />

        //     <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        //     <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        //     <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        //     <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

        //     <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        //     <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        //     <link rel="manifest" href="/manifest.json" />
        //     <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
        //     <link rel="shortcut icon" href="/favicon.ico" />
        //     <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

        //     <meta name="twitter:card" content="summary" />
        //     <meta name="twitter:url" content="https://dailies-702f2.web.app/" />
        //     <meta name="twitter:title" content="Dailies" />
        //     <meta name="twitter:description" content="Create your Dailies, stay aligned with your life!" />
        //     <meta name="twitter:image" content="https://dailies-702f2.web.app/icons/android-chrome-192x192.png" />
        //     <meta name="twitter:creator" content="@Hasan_sh" />
        //     <meta property="og:type" content="website" />
        //     <meta property="og:title" content="Dailies" />
        //     <meta property="og:description" content="Create your Dailies, stay aligned with your life!" />
        //     <meta property="og:site_name" content="Dailies" />
        //     <meta property="og:url" content="https://dailies-702f2.web.app" />
        //     <meta property="og:image" content="https://dailies-702f2.web.app/icons/apple-touch-icon.png" />
        // </Head>