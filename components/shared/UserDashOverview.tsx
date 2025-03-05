"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, DollarSign, Building } from "lucide-react";

interface Company {
  _id: string;
  name: string;
  employees: { _id: string }[];
  clients: { _id: string }[];
  totalRevenue: number;
}

const UserDashOverview = () => {
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
      <div className="text-center text-zinc-400 mt-10">Loading overview...</div>
    );
  }

  // Compute Metrics
  const totalRevenue = companies.reduce(
    (sum, company) => sum + company.totalRevenue,
    0
  );
  const totalEmployees = companies.reduce(
    (sum, company) => sum + company.employees.length,
    0
  );
  const totalClients = companies.reduce(
    (sum, company) => sum + company.clients.length,
    0
  );
  const totalCompanies = companies.length;

  // Pie Chart Data
  const revenueByCompanyData =
    totalRevenue > 0
      ? companies.map((company) => ({
          name: company.name,
          value: company.totalRevenue,
        }))
      : [{ name: "No Revenue Yet", value: 1 }];

  const employeesByCompanyData =
    totalEmployees > 0
      ? companies.map((company) => ({
          name: company.name,
          value: company.employees.length,
        }))
      : [{ name: "No Employees Yet", value: 1 }];

  const clientsByCompanyData =
    totalClients > 0
      ? companies.map((company) => ({
          name: company.name,
          value: company.clients.length,
        }))
      : [{ name: "No Clients Yet", value: 1 }];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Format Currency
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
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Building className="h-8 w-8 text-teal-500 mr-3" />
              <div className="text-2xl font-bold text-white">
                {totalCompanies}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-teal-500 mr-3" />
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-teal-500 mr-3" />
              <div className="text-2xl font-bold text-white">
                {totalEmployees}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-teal-500 mr-3" />
              <div className="text-2xl font-bold text-white">
                {totalClients}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={revenueByCompanyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value)}`
                  }
                >
                  {revenueByCompanyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employees Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Employee Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={employeesByCompanyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {employeesByCompanyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clients Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Client Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={clientsByCompanyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {clientsByCompanyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashOverview;
