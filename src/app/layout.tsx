import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CampusLens — Discover Your Perfect College",
  description:
    "AI-powered college discovery platform. Compare colleges, predict admissions, and make informed decisions about your future education.",
  keywords: "college, university, admission, compare, predictor, engineering, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans relative">
        <Navbar />
        <main className="flex-1 relative z-10 pt-20">{children}</main>
      </body>
    </html>
  );
}
