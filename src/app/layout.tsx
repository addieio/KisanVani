import type { Metadata, Viewport } from 'next';
import './globals.css';
import { KisanProvider } from '@/context/KisanContext';
import { HeaderSwitcher } from '@/components/HeaderSwitcher';
import { SpeechCaptions } from '@/components/SpeechCaptions';
import { VoiceMicButton } from '@/components/VoiceMicButton';

export const metadata: Metadata = {
  title: 'किसानवाणी (KisanVaani) · Farmer PWA & Mandi-Direct',
  description: 'Voice-first offline-capable agricultural operating system and B2B produce trading portal for Indian smallholders.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B7A3B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAF9] text-[#132A1C] antialiased flex flex-col selection:bg-emerald-200">
        <KisanProvider>
          {/* Top Unified Mode & Language Switcher Bar */}
          <HeaderSwitcher />

          {/* Subtitle / Spoken Audio Captions Toast */}
          <SpeechCaptions />

          {/* Main Application Viewport */}
          <main className="flex-1 pb-28">
            {children}
          </main>

          {/* Giant Floating Speech Mic (≥72px) */}
          <VoiceMicButton />
        </KisanProvider>
      </body>
    </html>
  );
}
