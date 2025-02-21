import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import "../globals.css";
import Sidebar from "@/components/shared/Sidebar";
import BottomBar from "@/components/shared/BottomBar";
import Header from "@/components/shared/Header";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HUBBER Dashboard",
  description: "Manage your business with ease",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900/90`}
        >
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
