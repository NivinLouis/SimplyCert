import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimplyCert – Free Bulk Certificate Generator | Upload Your Design, Add Names from CSV",
  description:
    "Generate personalized e-certificates in bulk for free. Upload your own certificate design, paste a name list or upload CSV, mark the text position, and download individual PDFs. No signup. No data upload. 100% private.",
  keywords: [
    "bulk certificate generator",
    "certificate generator from CSV",
    "bulk e-certificate generator free",
    "certificate generator upload own design",
    "generate certificates from CSV free",
    "batch certificate generator PDF",
    "certificate generator no signup",
    "certificate generator no watermark free",
    "free e-certificate generator",
    "workshop certificate generator",
    "personalized PDF certificates",
    "certificate generator no account required",
    "bulk certificate generator client side",
    "canva alternative for bulk certificates",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
