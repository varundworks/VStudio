import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";
import { SplashScreen } from "@/components/splash-screen";

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
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplashScreen>
          <AppLayout>
            <div className="p-4 md:p-8">{children}</div>
          </AppLayout>
        </SplashScreen>
      </body>
    </html>
  );
}
