import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className='border-b p-4'>
          <h1>OMU TTS</h1>
        </header>

        <main className='flex-1'>{children}</main>

        <footer className='border-t p-4'>
          <p>Copyright 2026 OMU TTS</p>
        </footer>
      </body>
    </html>
  );
}
