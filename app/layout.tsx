import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';

export const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
