import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib";
import { GoogleProvider } from "@/lib/providers/GoogleProvider";

export const metadata: Metadata = {
  title: "Linguapanda - AI-powered English Learning",
  description: "Personalized English learning platform with AI feedback",
  keywords: [
    "English learning",
    "AI",
    "CEFR",
    "Education",
    "AI learning",
    "Study English",
    "Study English Online",
  ],
  icons: {
    icon: "/icons/icon.svg",
  },
};

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className={`font-sans antialiased`}>
        <GoogleProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
