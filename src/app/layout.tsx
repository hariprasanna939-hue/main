import type { Metadata } from "next";
import { Poppins, Geist_Mono, Cormorant_Garamond, Sora, Playfair_Display } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "India & Sri Lanka Escape | Luxury Curated Travel Packages",
  description: "Discover once-in-a-lifetime luxury travel escapes, golden triangle tours, and scenic coastal safaris across India and Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorant.variable} ${geistMono.variable} ${sora.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
