"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"; // ✅ Correct import

import { Users, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

// Define the type for the company data
interface Company {
  id: number;
  name: string;
  employees: number;
  revenue: number;
  growth: string;
  location: string;
  status: string;
}

// Placeholder data
const companies: Company[] = [
  {
    id: 1,
    name: "TechCorp Solutions",
    employees: 150,
    revenue: 1500000,
    growth: "+12.5%",
    location: "New York, USA",
    status: "Active",
  },
  {
    id: 2,
    name: "Global Innovations",
    employees: 85,
    revenue: 900000,
    growth: "+8.3%",
    location: "London, UK",
    status: "Active",
  },
  {
    id: 3,
    name: "Digital Dynamics",
    employees: 220,
    revenue: 2100000,
    growth: "+15.7%",
    location: "San Francisco, USA",
    status: "Active",
  },
  {
    id: 4,
    name: "Future Systems",
    employees: 95,
    revenue: 850000,
    growth: "+6.2%",
    location: "Toronto, Canada",
    status: "Active",
  },
];

// Define the type for the chart data
interface ChartData {
  name: string;
  revenue: number;
}

const chartData: ChartData[] = companies.map((company) => ({
  name: company.name,
  revenue: company.revenue / 1000000, // Convert to millions
}));

export default function Dashboard() {
  return (
    <div className="container mx-auto p-2 space-y-8">
      {/* Revenue Chart */}
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Company Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                  tickFormatter={(value: number) => `$${value}M`} // ✅ Properly typed
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

      {/* Companies Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((company) => (
          <Link key={company.id} href="/companies" className="block group">
            <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:border-teal-500/50 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white">
                    {company.name}
                  </CardTitle>
                  <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <p className="text-sm text-zinc-400">{company.location}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-zinc-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Employees</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {company.employees}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-zinc-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm">Revenue</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      ${(company.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>

                {/* Growth & Status */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div className="flex items-center text-teal-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">
                      {company.growth}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2"></span>
                    <span className="text-sm text-zinc-400">
                      {company.status}
                    </span>
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
