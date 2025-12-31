// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth-options";
import SessionProvider from "@/src/providers/SessionProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "socialhub.support",
  description: "created by socialhub.support",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          {children}

          {/* Adsterra Social Bar script */}
          <Script
            id="adsterra-social-bar"
            src="https://chipnarrativefatherinlaw.com/37/20/17/372017259d2537ce82a9ca8a8d7bcd7e.js"
            strategy="afterInteractive"
          />
        </SessionProvider>
      </body>
    </html>
  );
}
