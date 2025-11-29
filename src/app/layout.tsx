import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { RegisterServiceWorker } from "./register-sw";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V Studio - Invoice & Quotation",
  description: "Create and manage invoices and quotations",
  manifest: '/manifest.json',
  themeColor: '#002D62',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'V Studio',
  },
  icons: {
    icon: '/app-logo.png',
    apple: '/app-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#002D62" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="V Studio" />
      </head>
      <body className={inter.className}>
        <RegisterServiceWorker />
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
