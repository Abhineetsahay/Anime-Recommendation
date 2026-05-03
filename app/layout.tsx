import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniList — Your Anime Universe, Organised",
  description:
    "Track, rate, and share your anime watchlists. Discover new anime through ML-powered recommendations based on your taste. Built for fans.",
  keywords: [
    "anime",
    "watchlist",
    "anime tracker",
    "anime recommendations",
    "myanimelist",
    "anime list",
    "manga",
    "jujutsu kaisen",
    "anime discovery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
