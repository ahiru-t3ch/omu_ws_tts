'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Studio' },
  { href: '/about', label: 'About' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 border-b border-emerald-200/60 bg-white/75 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6'>
        <Link href='/' className='group flex items-center gap-3'>
          <div className='relative rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-1 shadow-sm ring-1 ring-emerald-200/80 transition group-hover:shadow-md'>
            <Image
              src='/omu_tts_logo.png'
              alt='OMU TTS logo'
              width={48}
              height={48}
              className='rounded-lg'
              priority
            />
          </div>
          <div>
            <p className='text-lg font-bold tracking-tight text-emerald-900'>OMU TTS</p>
            <p className='text-xs font-medium text-emerald-600/90'>
              Text to speech · voice cloning soon
            </p>
          </div>
        </Link>
        <nav className='flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50/60 p-1'>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-200/80'
                    : 'text-emerald-700 hover:bg-white/70 hover:text-emerald-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
