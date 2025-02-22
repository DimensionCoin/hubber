"use client";
import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { CiLogout } from "react-icons/ci";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import LoadingPage from "./Loader";

const Header = () => {
  const { isLoaded, user } = useUser();

  // ✅ Show a loading state when Clerk is not loaded yet
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-black text-zinc-100">
        <LoadingPage />
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between w-full bg-zinc-900 text-zinc-100 py-6 px-4 md:px-8">
      <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
        HUBBER
      </h2>

      <div className="flex items-center gap-4">
        <SignedIn>
          {user && (
            <div className="flex gap-4 items-center">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                <span className="sr-only">View notifications</span>
              </Button>

              <div className="flex items-center gap-2">
                <UserButton />
                <span>{user.fullName}</span>
              </div>
            </div>
          )}

          <SignOutButton>
            <div className="flex cursor-pointer hover:text-red-500">
              <CiLogout size={24} />
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
