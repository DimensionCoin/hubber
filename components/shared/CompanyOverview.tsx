"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Users,
  DollarSign,
  Briefcase,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import toast from "react-hot-toast";
import { Tabs, TabsContent } from "../ui/tabs";

interface Employee {
  name: string;
  position: string;
  _id: string;
  imageUrl?: string;
}

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  imageUrl?: string;
}

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
  employees: Employee[];
  clients: Client[];
  totalRevenue: number;
  status: string;
  createdAt: string;
  companyUrl: string;
}

// Sample data for recent activities
const recentActivities = [
  {
    id: 1,
    action: "New client added",
    subject: "Sarah Johnson",
    timestamp: "2 hours ago",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 2,
    action: "Project completed",
    subject: "Website Redesign",
    timestamp: "Yesterday",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: 3,
    action: "Invoice paid",
    subject: "$12,500 payment received",
    timestamp: "2 days ago",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: 4,
    action: "New employee onboarded",
    subject: "Michael Chen - Developer",
    timestamp: "3 days ago",
    icon: <Users className="h-4 w-4" />,
  },
];

const CompanyOverview = () => {
  const { id: companyId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [monthlyGrowth] = useState({
    revenue: 8.5,
    employees: 5.2,
    clients: 12.3,
  });

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate revenue per employee
  const calculateRevenuePerEmployee = (company: Company) => {
    if (!company.employees.length) return 0;
    return company.totalRevenue / company.employees.length;
  };

  // Calculate revenue per client
  const calculateRevenuePerClient = (company: Company) => {
    if (!company.clients.length) return 0;
    return company.totalRevenue / company.clients.length;
  };

  // Generate data for client distribution chart
  const generateClientDistributionData = () => {
    if (!company) return [];

    // Group clients by company (if available)
    const clientCompanies: Record<string, number> = {};

    company.clients.forEach((client) => {
      const companyName = client.company || "Individual";
      clientCompanies[companyName] = (clientCompanies[companyName] || 0) + 1;
    });

    return Object.entries(clientCompanies).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Generate data for employee distribution chart
  const generateEmployeeDistributionData = () => {
    if (!company) return [];

    // Group employees by position
    const positions: Record<string, number> = {};

    company.employees.forEach((employee) => {
      positions[employee.position] = (positions[employee.position] || 0) + 1;
    });

    return Object.entries(positions).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Colors for charts
  const COLORS = ["#14b8a6", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444"];

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

  const clientDistributionData = generateClientDistributionData();
  const employeeDistributionData = generateEmployeeDistributionData();
  const revenuePerEmployee = calculateRevenuePerEmployee(company);
  const revenuePerClient = calculateRevenuePerClient(company);

  return (
    <Tabs value="overview">
      <TabsContent value="overview" className="mt-4">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Employees Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-teal-500 mr-3" />
                    <div className="text-2xl font-bold text-white">
                      {company.employees.length}
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      monthlyGrowth.employees >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {monthlyGrowth.employees >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(monthlyGrowth.employees)}%
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Revenue per employee: {formatCurrency(revenuePerEmployee)}
                </p>
              </CardContent>
            </Card>

            {/* Clients Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-teal-500 mr-3" />
                    <div className="text-2xl font-bold text-white">
                      {company.clients.length}
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      monthlyGrowth.clients >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {monthlyGrowth.clients >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(monthlyGrowth.clients)}%
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Revenue per client: {formatCurrency(revenuePerClient)}
                </p>
              </CardContent>
            </Card>

            {/* Revenue Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-teal-500 mr-3" />
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(company.totalRevenue)}
                    </div>
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      monthlyGrowth.revenue >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {monthlyGrowth.revenue >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(monthlyGrowth.revenue)}%
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Monthly growth rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Distribution */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Client Distribution
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Breakdown by company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {clientDistributionData.map((entry, index) => (
                          <Cell
                            key={`client-dist-${index}-${entry.name}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-zinc-800">
                <Button
                  variant="ghost"
                  className="w-full text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
                  onClick={() => router.push(`/company/${companyId}/clients`)}
                >
                  View All Clients
                </Button>
              </CardFooter>
            </Card>

            {/* Employee Distribution */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Employee Distribution
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Breakdown by position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={employeeDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {employeeDistributionData.map((entry, index) => (
                          <Cell
                            key={`employee-cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-zinc-800">
                <Button
                  variant="ghost"
                  className="w-full text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
                  onClick={() => router.push(`/company/${companyId}/employees`)}
                >
                  View All Employees
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={`activity-${activity.id}`} className="flex gap-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-teal-400">
                        {activity.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {activity.subject}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-zinc-800">
                <Button
                  variant="ghost"
                  className="w-full text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Top Employees and Clients */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Employees */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">
                    Top Employees
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {company.employees.slice(0, 4).map((employee) => (
                    <div
                      key={`employee-${employee._id}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {employee.imageUrl ? (
                            <AvatarImage
                              src={employee.imageUrl}
                              alt={employee.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-teal-500 text-white">
                              {employee.name
                                ? employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "E"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {employee.name}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {employee.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-zinc-800">
                <Button
                  variant="ghost"
                  className="w-full text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
                  onClick={() => router.push(`/company/${companyId}/employees`)}
                >
                  View All Employees
                </Button>
              </CardFooter>
            </Card>

            {/* Top Clients */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">
                    Top Clients
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {company.clients.slice(0, 4).map((client, index) => (
                    <div
                      key={`client-${client._id || `index-${index}`}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {client.imageUrl ? (
                            <AvatarImage
                              src={client.imageUrl}
                              alt={`${client.firstName} ${client.lastName}`}
                            />
                          ) : (
                            <AvatarFallback className="bg-violet-500 text-white">
                              {client.firstName && client.lastName
                                ? client.firstName[0] + client.lastName[0]
                                : "C"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {client.company || "Individual Client"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-zinc-800">
                <Button
                  variant="ghost"
                  className="w-full text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
                  onClick={() => router.push(`/company/${companyId}/clients`)}
                >
                  View All Clients
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CompanyOverview;
