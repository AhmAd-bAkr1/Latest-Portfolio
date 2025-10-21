import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalSilk from "./components/GlobalSilk";

// ✅ Load fonts with optimal strategy for performance
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ensures text visible during font load
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ SEO and Accessibility metadata
export const metadata: Metadata = {
   metadataBase: new URL('https://latest-portfolio-omega-five.vercel.app/'),
  title: "Ahmed Bakr — Front-End Developer",
  description:
    "Modern and high-performance web applications built with precision and creativity. Crafted by Ahmed Bakr.",
  keywords: [
    "Ahmed Bakr",
    "Front-End Developer",
    "Web Development",
    "React",
    "Next.js",
    "GSAP",
    "أحمد بكر", // Arabic version of the name
  ],
  authors: [{ name: "Ahmed Bakr" }],
  openGraph: {
    title: "Ahmed Bakr — Front-End Developer",
    description:
      "Crafting visually stunning and high-performance web experiences.",
    url: "https://latest-portfolio-omega-five.vercel.app/", // ✅ replace with your real domain later
    siteName: "Ahmed Bakr Portfolio",
    images: [
      {
        url: "/og-image.png", // ✅ add this image in /public for better Lighthouse SEO
        width: 1200,
        height: 630,
        alt: "Ahmed Bakr Portfolio Preview",
      },
    ],
    locale: "ar_EG", // Arabic locale for SEO
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// ✅ Root layout with improved structure and SEO attributes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Performance: preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* ✅ Accessibility: Add theme-color for PWA/Lighthouse */}
        <meta name="theme-color" content="#000000" />
        
        {/* ✅ Move viewport to head */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* ✅ Add structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ahmed Bakr",
              url: "https://latest-portfolio-omega-five.vercel.app/",
              image: "https://ahmedbakr.dev/og-image.jpg",
              sameAs: [
                "https://www.linkedin.com/in/ahmdbakr",
                "https://github.com/AhmAd-bAkr1",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <GlobalSilk/>
        {children}
      </body>
    </html>
  );
}
