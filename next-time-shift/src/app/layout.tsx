import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/components/auth/auth-provider";
import NavMenu from "@/src/app/components/navbar/nav-menu";
import Footer from "@/app/components/footer/footer";
import * as config from "@/lib/config";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
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
    <AuthProvider>
      <html lang="en">
        <body className={`${rubik.variable}`} >
          <NavMenu />
          {children}
          <Footer name={config.title} />
        </body>
      </html>
    </AuthProvider>
  );
}
