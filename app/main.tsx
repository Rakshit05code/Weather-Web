import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "WeatherBot - AI-Powered Weather Assistant",
  description:
    "Get accurate weather forecasts with AI-powered insights, advanced meteorological data, and beautiful visualizations. Your intelligent weather companion.",
  generator: "v0.app",
  applicationName: "WeatherBot",
  referrer: "origin-when-cross-origin",
  keywords: [
    "weather",
    "forecast",
    "AI",
    "chatbot",
    "meteorology",
    "weather assistant",
    "climate",
    "temperature",
    "precipitation",
    "UV index",
    "air quality",
  ],
  authors: [{ name: "WeatherBot Team" }],
  creator: "WeatherBot",
  publisher: "WeatherBot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://weatherbot.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://weatherbot.vercel.app",
    title: "WeatherBot - AI-Powered Weather Assistant",
    description: "Get accurate weather forecasts with AI-powered insights and beautiful visualizations",
    siteName: "WeatherBot",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "WeatherBot Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherBot - AI-Powered Weather Assistant",
    description: "Get accurate weather forecasts with AI-powered insights and beautiful visualizations",
    images: ["/android-chrome-512x512.png"],
    creator: "@weatherbot",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="preconnect" href="https://geocoding-api.open-meteo.com" />
        <link rel="preconnect" href="https://air-quality-api.open-meteo.com" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="system" storageKey="weatherbot-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
