'use client';

import { useEffect, useMemo, useState } from 'react';

type LangCode = 'a' | 'b' | 'e' | 'f';
type VoiceOption = { voiceName: string; voiceLabel: string; gender: 'f' | 'm' };

const LANG_OPTIONS: { code: LangCode; label: string; flag: string }[] = [
  { code: 'a', label: 'American English', flag: '🇺🇸' },
  { code: 'b', label: 'British English', flag: '🇬🇧' },
  { code: 'e', label: 'Spanish', flag: '🇪🇸' },
  { code: 'f', label: 'French', flag: '🇫🇷' },
];

const VOICES_BY_LANG: Record<LangCode, VoiceOption[]> = {
  a: [
    { voiceName: 'af_heart', voiceLabel: 'Heart', gender: 'f' },
    { voiceName: 'af_bella', voiceLabel: 'Bella', gender: 'f' },
    { voiceName: 'am_fenrir', voiceLabel: 'Fenrir', gender: 'm' },
    { voiceName: 'am_michael', voiceLabel: 'Michael', gender: 'm' },
  ],
  b: [{ voiceName: 'bf_emma', voiceLabel: 'Emma', gender: 'f' }],
  e: [
    { voiceName: 'ef_dora', voiceLabel: 'Dora', gender: 'f' },
    { voiceName: 'em_alex', voiceLabel: 'Alex', gender: 'm' },
  ],
  f: [{ voiceName: 'ff_siwis', voiceLabel: 'Siwis', gender: 'f' }],
};

function Spinner() {
  return (
    <svg
      className='h-5 w-5 animate-spin-slow text-white'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='3'
      />
      <path
        className='opacity-90'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
      />
    </svg>
  );
}

function WaveBars({ active }: { active: boolean }) {
  const heights = [40, 65, 35, 80, 50, 70, 45, 60, 30, 75, 55, 40];
  return (
    <div
      className='flex h-16 items-end justify-center gap-1'
      aria-hidden={!active}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full bg-emerald-400/80 transition-all duration-300 ${
            active ? 'animate-pulse-soft' : 'opacity-30'
          }`}
          style={{
            height: `${h}%`,
            animationDelay: active ? `${i * 0.07}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const envLimit = Number(process.env.NEXT_PUBLIC_TTS_TEXT_LIMIT ?? '5000');
  const LIMIT = Number.isFinite(envLimit) && envLimit > 0 ? envLimit : 5000;
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFilename, setAudioFilename] = useState('');
  const [langCode, setLangCode] = useState<LangCode>('a');
  const [voice, setVoice] = useState('af_heart');
  const [speed, setSpeed] = useState(1);

  const remaining = LIMIT - text.length;
  const usedPercent = Math.min(100, Math.round((text.length / LIMIT) * 100));
  const voiceOptions = VOICES_BY_LANG[langCode];
  const selectedLang = LANG_OPTIONS.find((l) => l.code === langCode);
  const selectedVoice = voiceOptions.find((v) => v.voiceName === voice);

  const progressTone = useMemo(() => {
    if (usedPercent >= 95) return 'bg-amber-500';
    if (usedPercent >= 80) return 'bg-emerald-500';
    return 'bg-teal-500';
  }, [usedPercent]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    const firstVoiceForLang = VOICES_BY_LANG[langCode][0]?.voiceName ?? '';
    const isCurrentVoiceValid = VOICES_BY_LANG[langCode].some(
      (voiceOption) => voiceOption.voiceName === voice
    );
    if (!isCurrentVoiceValid) setVoice(firstVoiceForLang);
  }, [langCode, voice]);

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      setError('Please enter some text first.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang_code: langCode,
          voice,
          speed,
          split_pattern: '\\n+',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error ?? `Request failed with ${response.status}`);
      }

      const audioBlob = await response.blob();
      const nextAudioUrl = URL.createObjectURL(audioBlob);
      const contentDisposition = response.headers.get('content-disposition') ?? '';
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
      const filename = filenameMatch?.[1] ?? 'tts.wav';
      setAudioFilename(filename);
      setAudioUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return nextAudioUrl;
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Unexpected error while generating audio.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const panelClass =
    'rounded-2xl border border-emerald-200/80 bg-white/85 p-5 shadow-xl shadow-emerald-900/5 backdrop-blur-sm md:p-6';

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10'>
      <section className='mb-8 max-w-2xl'>
        <p className='mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          Kokoro-powered voices
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight text-emerald-950 md:text-4xl'>
          Turn text into natural speech
        </h1>
        <p className='mt-3 text-base leading-relaxed text-slate-600'>
          Type or paste your script, pick a language and voice, then generate a
          WAV file in seconds.
        </p>
        <p className='mt-3 text-sm text-slate-500'>
          <span className='font-semibold text-emerald-800'>Voice cloning</span> is
          planned and currently under construction.
        </p>
      </section>

      <div className='grid gap-6 lg:grid-cols-5 lg:items-start'>
        <div className={`${panelClass} lg:col-span-3`}>
          <div className='mb-3 flex items-center justify-between gap-3'>
            <label htmlFor='tts-text' className='text-sm font-semibold text-emerald-900'>
              Your text
            </label>
            {text ? (
              <button
                type='button'
                onClick={() => {
                  setText('');
                  setError('');
                }}
                className='text-xs font-semibold text-emerald-700 transition hover:text-emerald-900'
              >
                Clear
              </button>
            ) : null}
          </div>

          <textarea
            id='tts-text'
            className='min-h-52 w-full resize-y rounded-xl border border-emerald-200/90 bg-emerald-50/30 px-4 py-3 text-[15px] leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100'
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={LIMIT}
            placeholder='Write something to hear it spoken…'
          />

          <div className='mt-3'>
            <div className='mb-1.5 flex justify-between text-xs font-medium text-slate-500'>
              <span>{text.length.toLocaleString()} / {LIMIT.toLocaleString()} characters</span>
              <span>{remaining.toLocaleString()} left</span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-emerald-100'>
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressTone}`}
                style={{ width: `${usedPercent}%` }}
              />
            </div>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='lang-select' className='text-sm font-semibold text-emerald-900'>
                Language
              </label>
              <select
                id='lang-select'
                className='w-full appearance-none rounded-xl border border-emerald-200/90 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100'
                value={langCode}
                onChange={(e) => setLangCode(e.target.value as LangCode)}
              >
                {LANG_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='voice-select' className='text-sm font-semibold text-emerald-900'>
                Voice
              </label>
              <select
                id='voice-select'
                className='w-full appearance-none rounded-xl border border-emerald-200/90 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100'
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
              >
                {voiceOptions.map((voiceOption) => (
                  <option key={voiceOption.voiceName} value={voiceOption.voiceName}>
                    {voiceOption.voiceLabel} ({voiceOption.gender === 'f' ? 'female' : 'male'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='mt-4'>
            <div className='mb-2 flex items-center justify-between'>
              <label htmlFor='speed-range' className='text-sm font-semibold text-emerald-900'>
                Speed
              </label>
              <span className='rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800'>
                {speed.toFixed(1)}×
              </span>
            </div>
            <input
              id='speed-range'
              type='range'
              min={0.5}
              max={2}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className='h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-100 accent-emerald-600'
            />
            <div className='mt-1 flex justify-between text-xs text-slate-400'>
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {error ? (
            <div
              role='alert'
              className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
            >
              {error}
            </div>
          ) : null}

          <button
            type='button'
            onClick={handleGenerateAudio}
            disabled={isLoading || !text.trim()}
            className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
          >
            {isLoading ? (
              <>
                <Spinner />
                Generating audio…
              </>
            ) : (
              <>
                <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
                  <path d='M8 5v14l11-7z' />
                </svg>
                Generate audio
              </>
            )}
          </button>
        </div>

        <aside className={`${panelClass} lg:col-span-2 lg:sticky lg:top-24`}>
          <h2 className='text-sm font-semibold uppercase tracking-wide text-emerald-800/80'>
            Output
          </h2>

          {audioUrl ? (
            <div className='mt-4 space-y-4'>
              <div className='rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-teal-50/80 px-4 py-5'>
                <WaveBars active={!isLoading} />
                <p className='mt-3 text-center text-sm font-semibold text-emerald-900'>
                  Ready to play
                </p>
                <p className='mt-1 truncate text-center text-xs text-slate-500'>
                  {audioFilename}
                </p>
              </div>
              <audio controls src={audioUrl} className='w-full rounded-lg' />
              <a
                href={audioUrl}
                download={audioFilename || 'tts.wav'}
                className='flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50'
              >
                <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden>
                  <path d='M12 3v12m0 0l4-4m-4 4L8 11M4 21h16' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
                Download WAV
              </a>
              <dl className='grid grid-cols-2 gap-2 text-xs'>
                <div className='rounded-lg bg-emerald-50/80 px-3 py-2'>
                  <dt className='text-slate-500'>Language</dt>
                  <dd className='font-semibold text-emerald-900'>
                    {selectedLang?.flag} {selectedLang?.label}
                  </dd>
                </div>
                <div className='rounded-lg bg-emerald-50/80 px-3 py-2'>
                  <dt className='text-slate-500'>Voice</dt>
                  <dd className='font-semibold text-emerald-900'>
                    {selectedVoice?.voiceLabel ?? voice}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className='mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-emerald-200/80'>
                <svg
                  className='h-7 w-7 text-emerald-600'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  aria-hidden
                >
                  <path
                    d='M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-2c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <p className='text-sm font-semibold text-emerald-900'>No audio yet</p>
              <p className='mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500'>
                Your generated clip will appear here with playback and download.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
