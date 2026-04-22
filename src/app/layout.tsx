import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  authorDescription,
  authorEmail,
  authorGithub,
  authorKeywords,
  authorLinkedIn,
  authorName,
  defaultDescription,
  defaultOgImage,
  defaultTitle,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
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
    ...authorKeywords,
  ],
  authors: [{ name: authorName, url: authorGithub }],
  creator: authorName,
  publisher: authorName,
  applicationName: siteName,
  category: 'productivity',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    emails: [authorEmail],
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "SimplyCert batch certificate generator landing page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
    creator: '@NivinLouis',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    author: authorName,
    'contact:email': authorEmail,
    'profile:github': authorGithub,
    'profile:linkedin': authorLinkedIn,
    'description:author': authorDescription,
  },
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
