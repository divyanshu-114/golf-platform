import type { Metadata } from "next";
import { Marcellus, Jost } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  variable: "--font-marcellus",
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GolfGives — Premium Golf Resort & Charity Platform",
  description:
    "Experience the perfect harmony of golf, luxury, and purpose. Subscribe, play, and support charities that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${marcellus.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
