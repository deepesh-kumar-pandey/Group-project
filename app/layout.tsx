
import { Inter, Sora, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/main/Header';
import Cursor from '@/components/ui/Cursor';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sora.variable} ${spaceGrotesk.variable} font-sans bg-[#070B14] text-white`}
      >
        <Cursor />
        <Header />
        {children}
      </body>
    </html>
  );
}
