"use client";
import { useEffect, useState } from "react";
import { Bell, Menu,  } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./CompanySidebar";
import { UserButton,  } from "@clerk/nextjs";

interface HeaderProps {
  title?: string;
  companyId?: string;
}

export function Header({ title = "Dashboard", companyId }: HeaderProps) {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch company name dynamically
  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;

      try {
        const response = await fetch(
          `/api/public/company?companyId=${companyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch company");

        const data = await response.json();
        setCompanyName(data.name);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden bg-zinc-900 border-zinc-800"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-64 bg-zinc-900 border-r border-zinc-800"
            >
              <Sidebar companyId={companyId} />
            </SheetContent>
          </Sheet>

          {/* ✅ Display Company Name in Dashboard Title */}
          <h1 className="text-xl font-semibold hidden md:block">
            {loading
              ? "Loading..."
              : companyName
              ? `${companyName} OS`
              : title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          
          <Button variant="outline" size="icon" className="relative ">
            <Bell className="h-5 w-5 text-black " />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-teal-500 text-[10px] font-medium flex items-center justify-center">
              3
            </span>
          </Button>
         <UserButton/>
        </div>
      </div>
    </header>
  );
}
