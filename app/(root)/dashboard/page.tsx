"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/providers/UserProvider";
import UserDashLeads from "@/components/shared/UserDashLeads";
import UserDashOverview from "@/components/shared/UserDashOverview";
import UserDashCompanies from "@/components/shared/UserDashCompanies";
import UserDashAnalytics from "@/components/shared/UserDashAnalytics";


export default function Dashboard() {
  const { isAuthenticated } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  // Fetch user companies from API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        // In a real app, you'd fetch from your API
        // For now, we'll use our enhanced sample data
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchCompanies();
    } else {
      // For demo purposes, load sample data even if not authenticated
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto p-4 space-y-6 mb-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400">
            Manage and monitor all your business entities in one place
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
            <p className="text-zinc-400">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Dashboard Tabs */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-zinc-800 border border-zinc-700 p-0.5 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-zinc-900"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="data-[state=active]:bg-zinc-900"
              >
                Companies
              </TabsTrigger>
              <TabsTrigger
                value="leads"
                className="data-[state=active]:bg-zinc-900"
              >
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-zinc-900"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <UserDashOverview />
            </TabsContent>

            {/* Companies Tab */}
            <TabsContent value="companies">
              <UserDashCompanies />
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads">
              <UserDashLeads />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <UserDashAnalytics />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
