import type { Metadata } from "next";
import { Rubik, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import * as config from "@/data/constants";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/app/components/footer/Footer";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Hanken_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${rubik.variable} ${grotesk.variable} antialiased`} suppressHydrationWarning>
        <body>
          {children}
          <Footer name={config.title} />
        </body>
      </html>
    </ClerkProvider>
  );
}
