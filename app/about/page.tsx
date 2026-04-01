'use client';

export default function AboutPage() {
  return (
    <div className='min-h-full p-4 md:p-6'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-lg shadow-emerald-200/40 md:p-6'>
        <h2 className='text-2xl font-bold text-emerald-700'>About OMU TTS</h2>
        <p className='text-gray-700'>
          OMU TTS is a text-to-speech service designed to generate high-quality audio from text.
        </p>
        <p className='text-gray-700'>
          OMU means parrot in Japanese. The project focuses on a clean user experience, multiple
          languages, and selectable voices.
        </p>
        <p className='text-gray-700'>
          Developed by{' '}
          <a
            href='https://www.ahiru-t3ch.com'
            target='_blank'
            rel='noreferrer'
            className='font-medium text-emerald-700 underline decoration-emerald-400 underline-offset-2 hover:text-emerald-800'
          >
            Ahiru-T3ch
          </a>
          .
        </p>
        <p className='text-gray-700'>
          This service is based on the{' '}
          <a
            href='https://huggingface.co/hexgrad/Kokoro-82M'
            target='_blank'
            rel='noreferrer'
            className='font-medium text-emerald-700 underline decoration-emerald-400 underline-offset-2 hover:text-emerald-800'
          >
            Kokoro model
          </a>
          .
        </p>
      </div>
    </div>
  );
}
