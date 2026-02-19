import type { Metadata, Viewport } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { LeftRail } from '@/components/layout/LeftRail';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { DesktopAuthButton } from '@/components/auth/DesktopAuthButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: 'Marathon Intel - Player Stats & Analytics',
  description: 'Premium stats tracking and analytics for Marathon players',
  icons: {
    icon: '/images/avatars/marathon logo.jpg',
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
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
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
      <body className="min-h-screen bg-background-base text-text-primary font-sans antialiased" suppressHydrationWarning>
        <SessionProvider>
          <AppProvider>
            <MobileHeader />
            <div className="min-h-screen md:grid md:grid-cols-[340px_1fr]">
              <LeftRail />
              <main className="min-w-0 overflow-x-hidden p-0 md:p-6">
                {children}
              </main>
            </div>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
