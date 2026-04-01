'use client';

import { useEffect, useState } from 'react';

type LangCode = 'a' | 'b' | 'e' | 'f';
type VoiceOption = { voiceName: string; voiceLabel: string; gender: 'f' | 'm' };

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
  const remaining = LIMIT - text.length;
  const voiceOptions = VOICES_BY_LANG[langCode];

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const firstVoiceForLang = VOICES_BY_LANG[langCode][0]?.voiceName ?? '';
    const isCurrentVoiceValid = VOICES_BY_LANG[langCode].some(
      (voiceOption) => voiceOption.voiceName === voice
    );

    if (!isCurrentVoiceValid) {
      setVoice(firstVoiceForLang);
    }
  }, [langCode, voice]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          lang_code: langCode,
          voice,
          speed: 1.0,
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
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return nextAudioUrl;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error while generating audio.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='min-h-full p-4 md:p-6'>
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-lg shadow-emerald-200/40 md:p-6'>

    <textarea
    className="min-h-56 w-full rounded-md border border-emerald-300 bg-white p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
    value={text}
    onChange={handleChange}
    maxLength={LIMIT}
    placeholder="Enter your text here"
    />
    <p className='text-sm text-emerald-700'>{remaining} characters remaining</p>
    <div className='mt-2 grid grid-cols-1 gap-3 md:grid-cols-2'>
      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium text-emerald-800' htmlFor='lang-select'>
          Language
        </label>
        <select
          id='lang-select'
          className='w-full rounded-md border border-emerald-300 bg-white p-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
          value={langCode}
          onChange={(e) => setLangCode(e.target.value as LangCode)}
        >
          <option value='a'>American English</option>
          <option value='b'>British English</option>
          <option value='e'>Spanish</option>
          <option value='f'>French</option>
        </select>
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium text-emerald-800' htmlFor='voice-select'>
          Voice
        </label>
        <select
          id='voice-select'
          className='w-full rounded-md border border-emerald-300 bg-white p-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          {voiceOptions.map((voiceOption) => (
            <option key={voiceOption.voiceName} value={voiceOption.voiceName}>
              {voiceOption.voiceLabel} ({voiceOption.gender})
            </option>
          ))}
        </select>
      </div>
    </div>
    {error ? <p className='text-sm text-red-600'>{error}</p> : null}

    <button
    className='self-start rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
    onClick={handleGenerateAudio}
    disabled={isLoading || !text.trim()}
    >
      {isLoading ? 'Generating...' : 'Generate audio'}
    </button>
    {audioUrl ? (
      <div className='mt-2 flex flex-col gap-1'>
        <p className='text-sm text-emerald-800'>{audioFilename}</p>
        <audio controls src={audioUrl} className='w-full' />
        <a
          href={audioUrl}
          download={audioFilename || 'tts.wav'}
          className='mt-2 self-start rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700'
        >
          Download audio
        </a>
      </div>
    ) : null}

    </div>
    </div>
  );
}
