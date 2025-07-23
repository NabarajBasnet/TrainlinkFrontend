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
  title: "Trainlink",
  description: "All in one fitness focused trainer and client management platform",
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
