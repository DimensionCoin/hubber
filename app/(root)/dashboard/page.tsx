"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Users, DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import { useUserContext } from "@/providers/UserProvider";

interface Employee {
  name: string;
  position: string;
}

interface Company {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  employees: Employee[]; // ✅ Fix `any[]` type
  totalRevenue: number;
  status: string;
  createdAt: string; // ISO string from MongoDB
}

export default function Dashboard() {
  const { isAuthenticated } = useUserContext();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user companies from API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Failed to fetch companies");

        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchCompanies();
    }
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto p-2 space-y-8">
      {loading && (
        <div className="text-center text-white">Loading companies...</div>
      )}

      {!loading && companies.length === 0 && (
        <div className="text-center text-zinc-400">
          No companies found. Start by creating one.
        </div>
      )}

      {companies.length > 0 && (
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Company Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={companies.map((c) => ({
                    name: c.name,
                    revenue: c.totalRevenue / 1000000,
                  }))}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--teal-500))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((company) => (
          <Link
            key={company._id}
            href={`/company/${company._id}`}
            className="block group"
          >
            <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:border-teal-500/50 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white">
                    {company.name}
                  </CardTitle>
                  <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <p className="text-sm text-zinc-400">
                  {company.address.city}, {company.address.country}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-zinc-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Employees</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {company.employees.length}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-zinc-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm">Revenue</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      ${(company.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          company.status === "active"
                            ? "bg-teal-400"
                            : "bg-red-400"
                        }`}
                      ></span>
                      <span className="text-sm text-zinc-400">
                        {company.status}
                      </span>
                    </div>

                    {/* Active Since Date */}
                    <div className="flex items-center text-teal-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium capitalize">
                        Active since{" "}
                        {new Date(company.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
