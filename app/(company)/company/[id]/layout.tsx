"use client";

import type React from "react";
import "@/app/globals.css";
import { useParams } from "next/navigation";
import { Header } from "@/components/shared/CompanyHeader";
import { Sidebar } from "@/components/shared/CompanySidebar";
import { ClerkProvider } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const companyId = params?.id as string | undefined;

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-zinc-950 text-zinc-100">
          <div className="flex h-screen">
            {/* Sidebar - Desktop only */}
            <div className="hidden md:block">
              <Sidebar companyId={companyId} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto ">
              <div className="md:hidden">
                <Header
                  companyId={companyId}
                />
              </div>
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
