"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  Home,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  companyId?: string;
}

export function Sidebar({ companyId }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <aside className="w-64 flex-col bg-zinc-900 border-r border-zinc-800 h-full">
      <div className="flex flex-col h-full">
       
        <div className="flex-1 py-4 mt-14">
          <nav className="px-4 space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                isActive("/dashboard")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <Home
                className={`h-5 w-5 ${
                  isActive("/dashboard") ? "text-teal-500" : "text-zinc-400"
                }`}
              />
              Dashboard
            </Link>
            {companyId && (
              <>
                <Link
                  href={`/company/${companyId}`}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                    isActive(`/company/${companyId}`) &&
                    !isActive(`/company/${companyId}/employee`) &&
                    !isActive(`/company/${companyId}/jobsite`)
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Building
                    className={`h-5 w-5 ${
                      isActive(`/company/${companyId}`) &&
                      !isActive(`/company/${companyId}/employee`) &&
                      !isActive(`/company/${companyId}/jobsite`)
                        ? "text-teal-500"
                        : "text-zinc-400"
                    }`}
                  />
                  Company
                </Link>
                <Link
                  href={`/company/${companyId}/employee/${companyId}`}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                    isActive(`/company/${companyId}/employee`)
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Users
                    className={`h-5 w-5 ${
                      isActive(`/company/${companyId}/employee`)
                        ? "text-teal-500"
                        : "text-zinc-400"
                    }`}
                  />
                  Employees
                </Link>
                <Link
                  href={`/company/${companyId}/jobsite/${companyId}`}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                    isActive(`/company/${companyId}/jobsite`)
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Briefcase
                    className={`h-5 w-5 ${
                      isActive(`/company/${companyId}/jobsite`)
                        ? "text-teal-500"
                        : "text-zinc-400"
                    }`}
                  />
                  Projects
                </Link>
              </>
            )}
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-zinc-300 hover:bg-zinc-800"
            >
              <FileText className="h-5 w-5 text-zinc-400" />
              Documents
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-zinc-300 hover:bg-zinc-800"
            >
              <BarChart3 className="h-5 w-5 text-zinc-400" />
              Analytics
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-zinc-300 hover:bg-zinc-800"
            >
              <Settings className="h-5 w-5 text-zinc-400" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
