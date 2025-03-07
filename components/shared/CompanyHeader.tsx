"use client";
import {  Menu, MessageCircle,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./CompanySidebar";
import Link from "next/link";

interface HeaderProps {
  companyId?: string;
}

export function Header({  companyId }: HeaderProps) {

  return (
    <header className="bg-zinc-900 sticky top-0 z-10">
      <div className="flex items-center justify-between h-10 px-2 py-1">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden bg-zinc-900 border-zinc-800 mt-2"
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
        </div>
        <div className="flex items-center justify-center mt-2">
          <Link href={`/company/${companyId}/messages`}>
            <Button>
              <MessageCircle />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
