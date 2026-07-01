import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | PSA MisOr IOMS",
    default: "PSA MisOr IOMS"
  },
  description: "Integrated Operations Management System"
};

import { RouteCleanup } from "@/components/layout/RouteCleanup";

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
      <body className={inter.className}>
        <RouteCleanup />
        <NextTopLoader color="#3b82f6" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
