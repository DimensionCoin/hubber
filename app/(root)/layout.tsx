import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import "../globals.css";
import Sidebar from "@/components/shared/Sidebar";
import BottomBar from "@/components/shared/BottomBar";
import Header from "@/components/shared/Header";

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
          {/* ✅ Toast Notifications */}
          <Toaster position="top-right" reverseOrder={false} />

          <div className="">
            <Header />
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
          </div>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
