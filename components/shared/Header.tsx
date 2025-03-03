"use client";
import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { CiLogout } from "react-icons/ci";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import LoadingPage from "./Loader";
import {  useEffect, useCallback } from "react";
import { getUser } from "@/actions/user.action";

const Header = () => {
  const { user, isLoaded } = useUser();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      await getUser(userId); // Removed unused state update
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData(user.id);
    }
  }, [isLoaded, user, fetchUserData]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-black text-zinc-100">
        <LoadingPage />
      </div>
    );
  }

  return (
    <header className="flex justify-between items-center w-full bg-zinc-950/80 backdrop-blur-lg py-4 px-4">
      <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
        HUBBER
      </h2>

      <div className="flex items-center gap-6">
        <SignedIn>
          {user && (
            <div className="flex gap-6 items-center">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                <span className="sr-only">View notifications</span>
              </Button>
              <div className="flex items-center gap-3">
                <UserButton />
                <span className="text-zinc-300">{user.firstName}</span>
              </div>
            </div>
          )}
          <SignOutButton>
            <div className="flex cursor-pointer text-zinc-400 hover:text-red-500 transition">
              <CiLogout size={24} />
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </header>
  );
};
export default Header;
