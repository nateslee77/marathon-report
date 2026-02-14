import type { Metadata } from 'next';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
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
      <body className="min-h-screen bg-background-base text-text-primary font-sans antialiased">
        <AppProvider>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '340px 1fr',
              minHeight: '100vh',
            }}
          >
            <LeftRail />
            <main style={{ minWidth: 0, overflowX: 'hidden', padding: '24px 24px' }}>
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
