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
      <head>
        {/* Google AdSense global script */}
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6395341448311243"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          {children}

          {/* Pop ad script (opens in new tab) */}
          <Script
            id="pop-ad-script"
            src="https://chipnarrativefatherinlaw.com/62/99/e6/6299e667e2f7e50c2a62c6283728c84b.js"
            strategy="afterInteractive"
          />
        </SessionProvider>
      </body>
    </html>
  );
}
