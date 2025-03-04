import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";
import PortalHeader from "@/components/shared/PortalHeader";
import PortalBottomBar from "@/components/shared/PortalBottomBar";

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
   
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-zinc-100`}
          >
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex flex-col min-h-screen">
              <PortalHeader />
              <div className="flex flex-1 w-full">
                
                {/* Main Content Area */}
                <main className="flex-1 w-full overflow-auto">{children}</main>
              </div>
              {/* Bottom Bar for small screens */}
              <div className=" w-full border-t border-zinc-800 bg-zinc-900">
                <PortalBottomBar />
              </div>
            </div>
          </body>
        </html>
    
  );
}
