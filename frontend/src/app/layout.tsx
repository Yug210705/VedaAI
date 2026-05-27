import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Toaster from '@/components/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI - AI Assessment Creator',
  description: 'Create and manage assignments with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#e4e7eb] text-foreground flex h-screen overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 overflow-hidden print:overflow-visible relative z-0 bg-transparent flex flex-col p-[4px] md:p-0 md:py-[12px] md:pr-[12px] md:pl-[4px] print:p-0">
          <div className="flex-1 bg-[#f4f5f7] print:bg-transparent rounded-[24px] print:rounded-none overflow-hidden print:overflow-visible flex flex-col relative shadow-[0_4px_24px_rgba(0,0,0,0.02)] print:shadow-none border border-white/60 print:border-none">
            {children}
            <Toaster />
          </div>
        </main>
      </body>
    </html>
  );
}
