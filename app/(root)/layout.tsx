import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-zinc-100`}
        >
          <Toaster position="top-right" reverseOrder={false} />

          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 w-full">
              {/* Sidebar for medium and large screens */}
              <aside className="hidden md:block ">
                <Sidebar />
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 w-full overflow-auto">{children}</main>
            </div>
            {/* Bottom Bar for small screens */}
            <div className="md:hidden w-full border-t border-zinc-800 bg-zinc-900">
              <BottomBar />
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
