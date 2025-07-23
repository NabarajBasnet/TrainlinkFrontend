import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/Theme/ThemeProvider";
import ReactQueryClientProvider from "@/components/Providers/ReactQuery/ReactQueryProvider";
import ReactReduxProvider from "@/components/Providers/Redux/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrainLink | Personal Trainer & Fitness Client Platform",
  description:
    "TrainLink is the all-in-one platform for fitness professionals and clients. Connect with certified personal trainers, manage sessions, track goals, and grow your fitness journey.",
  keywords: [
    "TrainLink",
    "personal trainer platform",
    "fitness app",
    "trainer client management",
    "online training",
    "fitness SaaS",
    "workout tracking",
    "hire a fitness coach",
    "trainer dashboard",
    "fitness scheduling app",
  ],
  authors: [{ name: "TrainLink Team", url: "https://trainlink.io" }],
  creator: "TrainLink",
  applicationName: "TrainLink",
  generator: "Next.js",
  metadataBase: new URL("https://trainlink.io"),
  openGraph: {
    title: "TrainLink | Manage Clients & Training Sessions",
    description:
      "For personal trainers and clients — connect, train, track, and grow. Join TrainLink today.",
    url: "https://trainlink.io",
    siteName: "TrainLink",
    images: [
      {
        url: "https://trainlink.io/og-image.png", // Replace with your image
        width: 1200,
        height: 630,
        alt: "TrainLink Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrainLink — Fitness Trainer & Client Management",
    description:
      "Find your fitness coach. Manage clients. Track your goals. All in one app.",
    site: "@trainlinkapp", // Replace with your actual handle
    creator: "@trainlinkapp",
    images: ["https://trainlink.io/og-image.png"], // Replace if needed
  },
  themeColor: "#F97316", // Your brand orange
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactReduxProvider>
          <ThemeProvider>
            <ReactQueryClientProvider>
              {children}
            </ReactQueryClientProvider>
          </ThemeProvider>
        </ReactReduxProvider>
      </body>
    </html>
  );
}
