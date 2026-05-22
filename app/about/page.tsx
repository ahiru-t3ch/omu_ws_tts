import Link from 'next/link';

const SKILLS = [
  'Next.js & React',
  'TypeScript',
  'Tailwind CSS',
  'REST API integration',
  'Docker & Compose',
  'UI / UX design',
  'TTS pipelines (Kokoro)',
] as const;

export default function AboutPage() {
  return (
    <div className='mx-auto max-w-3xl px-4 py-10 md:px-6'>
      <article className='rounded-2xl border border-emerald-200/80 bg-white/85 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-sm md:p-8'>
        <p className='mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800'>
          About the project
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight text-emerald-950'>
          About OMU TTS
        </h1>

        <div className='mt-6 space-y-8 text-base leading-relaxed text-slate-600'>
          <section className='space-y-3'>
            <h2 className='text-lg font-bold text-emerald-950'>What is OMU TTS?</h2>
            <p>
              OMU TTS is a text-to-speech web application: you enter text, choose a
              language and voice, and download a WAV file. <strong>OMU</strong> means
              parrot in Japanese — a nod to voices that repeat your words clearly.
            </p>
            <p>
              Speech is powered by the{' '}
              <a
                href='https://huggingface.co/hexgrad/Kokoro-82M'
                target='_blank'
                rel='noreferrer'
                className='font-semibold text-emerald-700 underline decoration-emerald-400/80 underline-offset-2 transition hover:text-emerald-900'
              >
                Kokoro-82M
              </a>{' '}
              model, served through a dedicated TTS API (OMU IA TTS). This site is the
              public-facing studio that talks to that API securely.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-lg font-bold text-emerald-950'>Project context</h2>
            <p>
              OMU TTS is an <strong>individual project</strong> — not a group assignment.
              I work on it alone as a <strong>solopreneur</strong>: one person covering
              product, design, frontend, and integration with the backend API.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-lg font-bold text-emerald-950'>Who is behind it?</h2>
            <p>
              <strong>
                <a
                  href='https://www.ahiru-t3ch.com'
                  target='_blank'
                  rel='noreferrer'
                  className='text-emerald-800 underline decoration-emerald-400/80 underline-offset-2 transition hover:text-emerald-950'
                >
                  Ahiru-T3ch
                </a>{' '}
                is me
              </strong>{' '}
              — my solo studio name for shipping software. When you see “by Ahiru-T3ch” in
              the footer, that is the same person who designs, builds, and maintains OMU
              TTS. There is no separate team hidden behind the brand for this product.
            </p>
            <p>
              Questions, partnerships, or early access: reach out via{' '}
              <a
                href='https://www.ahiru-t3ch.com'
                target='_blank'
                rel='noreferrer'
                className='font-semibold text-emerald-700 underline decoration-emerald-400/80 underline-offset-2 transition hover:text-emerald-900'
              >
                ahiru-t3ch.com
              </a>
              .
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-lg font-bold text-emerald-950'>Skills & stack</h2>
            <p>
              This project showcases full-stack delivery: a modern web UI, server-side API
              routes that proxy the TTS backend (token never exposed to the browser), and
              containerized deployment.
            </p>
            <ul className='flex flex-wrap gap-2'>
              {SKILLS.map((skill) => (
                <li
                  key={skill}
                  className='rounded-full border border-emerald-200/90 bg-emerald-50/80 px-3 py-1 text-sm font-medium text-emerald-900'
                >
                  {skill}
                </li>
              ))}
            </ul>
            <p className='text-sm text-slate-500'>
              Frontend: Next.js, React, TypeScript, Tailwind CSS · Backend bridge: Next.js
              Route Handlers · TTS service: OMU IA TTS (Docker) · Infra: Docker Compose,
              environment-based configuration.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-lg font-bold text-emerald-950'>Roadmap</h2>
            <div className='rounded-xl border border-amber-200/90 bg-amber-50/80 px-4 py-3 text-sm text-amber-950'>
              <p className='font-semibold text-amber-900'>Voice cloning — under construction</p>
              <p className='mt-1 text-amber-900/90'>
                Custom voice cloning will be part of OMU TTS. The feature is not available
                in the app yet; it will ship when the backend API is ready.
              </p>
            </div>
          </section>
        </div>

        <Link
          href='/'
          className='mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700'
        >
          Open the studio
        </Link>
      </article>
    </div>
  );
}
