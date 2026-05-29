import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSA - Misamis Oriental Operations Monitoring",
  description: "Integrated Operations Monitoring System"
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('ioms_theme') === 'dark' || (!('ioms_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <NextTopLoader color="#3b82f6" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
