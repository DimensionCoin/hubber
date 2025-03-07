"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyProfileHeader from "@/components/shared/CompanyProfileHeader";
import CompanyKeyMetrics from "@/components/shared/CompanyKeyMetrics";
import CompanyJobs from "@/components/shared/CompanyJobs";
import CompanyClients from "@/components/shared/CompanyClients";
import CompanyOverview from "@/components/shared/CompanyOverview";
import CompanyTeam from "@/components/shared/CompanyTeam";
import toast from "react-hot-toast";

interface Company {
  _id: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  address: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
  totalRevenue: number;
  status: string;
  createdAt: string;
  companyUrl: string;
}

const CompanyPage = () => {
  const { id: companyId } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch company details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(
          `/api/public/company?companyId=${companyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch company");
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
        toast.error("Failed to load company data.");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Company Not Found
          </h2>
          <p className="text-zinc-300 text-center mb-4">
            We couldn&apos;t find the company you&apos;re looking for. It may
            have been removed or you may not have access.
          </p>
          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Company Header */}
      <CompanyProfileHeader />

      {/* Dashboard Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="bg-zinc-800 border border-zinc-700 p-0.5">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-zinc-900"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-zinc-900"
            >
              Team
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="data-[state=active]:bg-zinc-900"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-zinc-900"
            >
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <CompanyOverview />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <CompanyJobs />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <CompanyTeam />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <CompanyClients />
          </TabsContent>
        </Tabs>

        {/* Key Metrics */}
        <CompanyKeyMetrics />
      </div>
    </>
  );
};

export default CompanyPage;
