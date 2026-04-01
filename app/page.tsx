'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const envLimit = Number(process.env.NEXT_PUBLIC_TTS_TEXT_LIMIT ?? '5000');
  const LIMIT = Number.isFinite(envLimit) && envLimit > 0 ? envLimit : 5000;
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFilename, setAudioFilename] = useState('');
  const remaining = LIMIT - text.length;

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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
          lang_code: 'a',
          voice: 'af_heart',
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
    <div className='flex flex-col gap-2 p-4'>

    <textarea
    className="w-full rounded-md border border-gray-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    value={text}
    onChange={handleChange}
    maxLength={LIMIT}
    placeholder="Enter your text here"
    />

    <p>{remaining} characters remaining</p>
    {error ? <p className='text-sm text-red-600'>{error}</p> : null}

    <button
    className='self-start rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
    onClick={handleGenerateAudio}
    disabled={isLoading || !text.trim()}
    >
      {isLoading ? 'Generating...' : 'Generate audio'}
    </button>
    {audioUrl ? (
      <div className='mt-2 flex flex-col gap-1'>
        <p className='text-sm text-gray-700'>{audioFilename}</p>
        <audio controls src={audioUrl} className='w-full' />
      </div>
    ) : null}

    </div>
  );
}
