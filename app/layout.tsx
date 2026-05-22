import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { SiteHeader } from './components/site-header';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OMU TTS',
  description: 'Text-to-speech demo — OMU TTS',
  icons: {
    icon: '/omu_tts_logo.png',
    apple: '/omu_tts_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={jakarta.variable}>
      <body className='flex min-h-screen flex-col bg-[#f4fbf7] font-sans text-slate-900 antialiased'>
        <Script
          src='https://stats.ahiru-t3ch.com/script.js'
          strategy='afterInteractive'
          data-website-id='0d18ba2a-2dd8-4000-b945-811b0cbb7e76'
        />
        <div
          aria-hidden
          className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'
        >
          <div className='absolute -left-24 top-0 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl' />
          <div className='absolute right-0 top-32 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl' />
          <div className='absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl' />
        </div>

        <SiteHeader />
        <main className='flex-1'>{children}</main>

        <footer className='border-t border-emerald-200/60 bg-white/50 py-6 text-center text-sm text-emerald-800 backdrop-blur'>
          <p className='font-medium'>Copyright 2026 OMU TTS</p>
          <p className='mt-1 text-emerald-700/90'>
            by{' '}
            <a
              href='https://www.ahiru-t3ch.com'
              target='_blank'
              rel='noreferrer'
              className='font-semibold text-emerald-700 underline decoration-emerald-400/80 underline-offset-2 transition hover:text-emerald-900'
            >
              Ahiru-T3ch
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
