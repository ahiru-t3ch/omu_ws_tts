import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-lime-50 to-cyan-50 text-gray-900">
        <header className='border-b border-emerald-200/70 bg-white/70 p-4 pl-8 backdrop-blur'>
          <div className='flex items-center justify-between pr-6'>
            <Link href='/' className='flex items-center gap-3'>
              <Image
                src='/omu_tts_logo.png'
                alt='OMU TTS logo'
                width={64}
                height={64}
                className='rounded-md'
                priority
              />
              <h1 className='text-xl font-bold tracking-tight text-emerald-700'>OMU TTS</h1>
            </Link>
            <nav className='flex items-center gap-4 text-sm font-medium text-emerald-800'>
              <Link className='hover:text-emerald-600' href='/'>
                Home
              </Link>
              <Link className='hover:text-emerald-600' href='/about'>
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className='flex-1'>{children}</main>

        <footer className='border-t border-emerald-200/70 bg-white/60 p-4 text-center text-sm text-emerald-800 backdrop-blur'>
          <p>Copyright 2026 OMU TTS</p>
          <p className='mt-1'>
            by{' '}
            <a
              href='https://www.ahiru-t3ch.com'
              target='_blank'
              rel='noreferrer'
              className='font-medium text-emerald-700 underline decoration-emerald-400 underline-offset-2 hover:text-emerald-800'
            >
              Ahiru-T3ch
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
