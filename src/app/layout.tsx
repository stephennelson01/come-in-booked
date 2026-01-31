import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comeinbooked.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "ComeInBooked - Book Local Services",
    template: "%s | ComeInBooked",
  },
  description:
    "Book beauty, wellness, and creative services from local providers in Nigeria. Find and book appointments instantly.",
  keywords: [
    "booking",
    "appointments",
    "beauty",
    "wellness",
    "spa",
    "salon",
    "local services",
    "Nigeria",
    "Lagos",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ComeInBooked - Book Local Services",
    description:
      "Book beauty, wellness, and creative services from local providers in Nigeria. Find and book appointments instantly.",
    url: appUrl,
    siteName: "ComeInBooked",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "ComeInBooked - Book Local Services",
    description:
      "Book beauty, wellness, and creative services from local providers in Nigeria.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="comeinbooked-theme">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
