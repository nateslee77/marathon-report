import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { LeftRail } from '@/components/layout/LeftRail';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Marathon Report - Player Stats & Analytics',
  description: 'Premium stats tracking and analytics for Marathon players',
  icons: {
    icon: '/images/Marathon_Bungie_Icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VE88YJW5RT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VE88YJW5RT');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background-base text-text-primary font-sans antialiased">
        <AppProvider>
          <div className="min-h-screen md:grid md:grid-cols-[340px_1fr]">
            <LeftRail />
            <main className="min-w-0 overflow-x-hidden p-0 md:p-6">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
