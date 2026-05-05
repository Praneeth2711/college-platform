import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CampusLens — Discover, Compare, Decide",
  description:
    "Decision-focused college discovery platform. Compare colleges side-by-side, highlight best values, and make informed decisions about your education.",
  keywords: "college, university, admission, compare, predictor, engineering, medical, management, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans relative text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative z-10 pt-20">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
