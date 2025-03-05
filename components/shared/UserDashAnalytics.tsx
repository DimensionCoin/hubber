"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Company {
  _id: string;
  name: string;
  employees: { _id: string }[];
  clients: { _id: string }[];
  totalRevenue: number;
  growthData: {
    months: string[];
    revenue: number[];
    employees: number[];
    clients: number[];
  };
}

const UserDashAnalytics = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

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

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-zinc-400 mt-10">
        Loading analytics...
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        No business data available. Start adding companies to see analytics.
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Growth Trends */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Business Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            {companies.length > 0 && companies[0].growthData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={companies[0].growthData.months.map((month, i) => ({
                    month,
                    revenue: companies[0].growthData.revenue[i] / 1000,
                    employees: companies[0].growthData.employees[i],
                    clients: companies[0].growthData.clients[i],
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#888888" />
                  <YAxis yAxisId="left" stroke="#14b8a6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (K)"
                    stroke="#14b8a6"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="employees"
                    name="Employees"
                    stroke="#8884d8"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="clients"
                    name="Clients"
                    stroke="#ffc658"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-white text-lg">
                No growth data available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue per Employee */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Revenue per Employee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.map((company) => {
                const revenuePerEmployee =
                  company.employees.length > 0
                    ? company.totalRevenue / company.employees.length
                    : 0;
                return (
                  <div key={company._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-white">{company.name}</p>
                      <p className="text-white font-medium">
                        {formatCurrency(revenuePerEmployee)}
                      </p>
                    </div>
                    <Progress
                      value={(revenuePerEmployee / 200000) * 100}
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue per Client */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Revenue per Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.map((company) => {
                const revenuePerClient =
                  company.clients.length > 0
                    ? company.totalRevenue / company.clients.length
                    : 0;
                return (
                  <div key={company._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-white">{company.name}</p>
                      <p className="text-white font-medium">
                        {formatCurrency(revenuePerClient)}
                      </p>
                    </div>
                    <Progress
                      value={(revenuePerClient / 300000) * 100}
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashAnalytics;
