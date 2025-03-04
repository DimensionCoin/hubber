"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUser } from "@/actions/user.action";

type SubscriptionTier = "free" | "basic" | "premium";

type UserContextType = {
  isAuthenticated: boolean;
  tier: SubscriptionTier;
  companyCount: number;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [companyCount, setCompanyCount] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      getUser(user.id).then((data) => {
        if (data) {
          setTier(data.subscriptionTier || "free");
          setCompanyCount(data.companies?.length || 0); // ✅ Fetch company count from the user model
        }
      });
    }
  }, [isLoaded, user]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: !!user,
        tier,
        companyCount, // ✅ Now available globally
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
