import type { Metadata } from "next";
import Script from "next/script";

export const dynamic = "force-dynamic";

import "@/app/globals.css";
import { AppProviders } from "@/app/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url
  },
  keywords: [
    "science projects",
    "arduino kits",
    "esp32 projects",
    "iot project store",
    "robotics kits india",
    "school science models"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AppProviders>
        {analyticsId ? (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
            <Script id="google-analytics">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${analyticsId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
