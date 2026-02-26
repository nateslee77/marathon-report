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
  description: 'Stat tracker for Marathon by Bungie. View player profiles, K/D, extraction rates, weapon loadouts, shell stats, match history, and performance graphs.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
