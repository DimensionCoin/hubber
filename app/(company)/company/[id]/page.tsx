"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Building,
  Plus,
  BarChart3,
  Mail,
  Phone,
  ExternalLink,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Globe2,
  Share2,
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Employee {
  name: string;
  position: string;
  _id: string;
  imageUrl?: string;
}

interface Client {
  name: string;
  email: string;
  phone: string;
  company: string;
  imageUrl?: string;
}

interface Project {
  id: string;
  name: string;
  status: "in-progress" | "completed" | "on-hold";
  progress: number;
  dueDate: string;
  client: string;
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

// Sample data for metrics and projects
const sampleMetrics = {
  monthlyRevenue: 42500,
  previousMonthRevenue: 38000,
  activeProjects: 8,
  previousMonthProjects: 6,
  clientSatisfaction: 92,
  previousMonthSatisfaction: 89,
  employeeUtilization: 87,
  previousMonthUtilization: 85,
};

const sampleProjects: Project[] = [
  {
    id: "proj1",
    name: "Website Redesign",
    status: "in-progress",
    progress: 65,
    dueDate: "2023-12-15",
    client: "Acme Corp",
  },
  {
    id: "proj2",
    name: "Mobile App Development",
    status: "in-progress",
    progress: 30,
    dueDate: "2024-02-28",
    client: "TechStart Inc",
  },
  {
    id: "proj3",
    name: "Brand Identity Refresh",
    status: "completed",
    progress: 100,
    dueDate: "2023-11-30",
    client: "Global Solutions",
  },
  {
    id: "proj4",
    name: "Marketing Campaign",
    status: "on-hold",
    progress: 45,
    dueDate: "2024-01-20",
    client: "Retail Giants",
  },
];

const recentActivities = [
  {
    id: 1,
    action: "New client added",
    subject: "Innovative Tech Solutions",
    timestamp: "2 hours ago",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 2,
    action: "Project completed",
    subject: "Annual Report Design",
    timestamp: "Yesterday",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: 3,
    action: "Invoice paid",
    subject: "$12,500 from Acme Corp",
    timestamp: "2 days ago",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: 4,
    action: "New employee onboarded",
    subject: "Sarah Johnson - UI Designer",
    timestamp: "3 days ago",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 5,
    action: "Project deadline extended",
    subject: "Mobile App Development",
    timestamp: "1 week ago",
    icon: <Calendar className="h-4 w-4" />,
  },
];

const CompanyPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/public/company?companyId=${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-500 text-blue-50";
      case "completed":
        return "bg-emerald-500 text-emerald-50";
      case "on-hold":
        return "bg-amber-500 text-amber-50";
      default:
        return "bg-zinc-500 text-zinc-50";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMetricChange = (current: number, previous: number) => {
    const percentChange = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(percentChange).toFixed(1),
      isPositive: percentChange >= 0,
    };
  };

  return (
    <>
      {/* Company Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {/* Company Name and Status */}
            <div className="flex items-center gap-3">
              <h1
                className="
        text-3xl 
        font-bold 
        bg-clip-text 
        text-transparent 
        bg-gradient-to-r 
        from-teal-400 
        via-cyan-400 
        to-violet-500"
              >
                {company.name}
              </h1>
              <Badge
                className={`
        ${
          company.status === "active"
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-zinc-500 hover:bg-zinc-600"
        } 
        text-white`}
              >
                {company.status.toUpperCase()}
              </Badge>
            </div>

            {/* Business Type */}
            <p className="text-sm text-zinc-300 mt-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              {company.businessType.toUpperCase()}
            </p>

            {/* Contact and Location Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 mt-2">
              {/* Location */}
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                {company.address.city}, {company.address.country}
              </p>

              {/* Phone */}
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                {company.phone}
              </p>

              {/* Email */}
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                {company.email}
              </p>

              {/* Company URL with Share Button */}
              <p className="text-sm text-zinc-300 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-teal-400" />
                {company.companyUrl}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      // Web Share API for modern browsers
                      navigator
                        .share({
                          title: `${company.name} Company Page`,
                          url: company.companyUrl,
                        })
                        .catch((err) => console.error("Share failed:", err));
                    } else {
                      // Fallback: Copy to clipboard
                      navigator.clipboard
                        .writeText(company.companyUrl)
                        .then(() => {
                          alert("URL copied to clipboard!");
                        })
                        .catch((err) => console.error("Copy failed:", err));
                    }
                  }}
                  className="text-teal-400 hover:text-teal-300 focus:outline-none"
                  aria-label="Share company URL"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => router.push(`/company/${id}/edit`)}
              variant="outline"
              className="border-zinc-700 text-black hover:text-white hover:bg-zinc-800"
            >
              Edit Company
            </Button>
            <Button
              onClick={() => window.open(company.companyUrl, "_blank")}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Key Metrics */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(sampleMetrics.monthlyRevenue)}
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.monthlyRevenue,
                        sampleMetrics.previousMonthRevenue
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.monthlyRevenue,
                      sampleMetrics.previousMonthRevenue
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.monthlyRevenue,
                        sampleMetrics.previousMonthRevenue
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>

            {/* Active Projects Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {sampleMetrics.activeProjects}
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.activeProjects,
                        sampleMetrics.previousMonthProjects
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.activeProjects,
                      sampleMetrics.previousMonthProjects
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.activeProjects,
                        sampleMetrics.previousMonthProjects
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>

            {/* Client Satisfaction Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Client Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {sampleMetrics.clientSatisfaction}%
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.clientSatisfaction,
                        sampleMetrics.previousMonthSatisfaction
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.clientSatisfaction,
                      sampleMetrics.previousMonthSatisfaction
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.clientSatisfaction,
                        sampleMetrics.previousMonthSatisfaction
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>

            {/* Employee Utilization Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Employee Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {sampleMetrics.employeeUtilization}%
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.employeeUtilization,
                        sampleMetrics.previousMonthUtilization
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.employeeUtilization,
                      sampleMetrics.previousMonthUtilization
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.employeeUtilization,
                        sampleMetrics.previousMonthUtilization
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-zinc-800 border border-zinc-700 p-0.5">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-zinc-900"
            >
              Overview
            </TabsTrigger>
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
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects Overview */}
              <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Project Status</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-300 hover:text-white"
                      onClick={() =>
                        router.push(`/company/${id}/jobsite/${id}`)
                      }
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {project.name}
                            </span>
                            <Badge
                              className={getProjectStatusColor(project.status)}
                            >
                              {project.status === "in-progress"
                                ? "In Progress"
                                : project.status === "completed"
                                ? "Completed"
                                : "On Hold"}
                            </Badge>
                          </div>
                          <span className="text-sm text-zinc-300">
                            Due:{" "}
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-2" />
                          <span className="text-xs font-medium text-white">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400">
                          Client: {project.client}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="mt-0.5 h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                          {activity.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white leading-none">
                            {activity.action}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {activity.subject}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Overview */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Financial Overview</CardTitle>
                <CardDescription className="text-zinc-300">
                  Total revenue and financial metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-300">
                      Total Revenue
                    </h3>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-teal-500" />
                      <span className="text-2xl font-bold text-white">
                        {formatCurrency(company.totalRevenue)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Lifetime company revenue
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-300">
                      Average Project Value
                    </h3>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-teal-500" />
                      <span className="text-2xl font-bold text-white">
                        {formatCurrency(company.totalRevenue / 12)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Based on completed projects
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-300">
                      Revenue Growth
                    </h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      <span className="text-2xl font-bold text-white">
                        +18.5%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Year over year growth
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">All Projects</CardTitle>
                  <Button
                    onClick={() => router.push(`/company/${id}/new-project`)}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-zinc-800 rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-lg text-white">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getProjectStatusColor(project.status)}
                            >
                              {project.status === "in-progress"
                                ? "In Progress"
                                : project.status === "completed"
                                ? "Completed"
                                : "On Hold"}
                            </Badge>
                            <span className="text-sm text-zinc-300">
                              Due:{" "}
                              {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">
                            Client: {project.client}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-1/3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">
                              Progress
                            </span>
                            <span className="text-sm text-white">
                              {project.progress}%
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-zinc-700 hover:bg-zinc-800"
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-600 text-white"
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Team Members</CardTitle>
                  <Button
                    onClick={() => router.push(`/company/${id}/new-employee`)}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.employees.length > 0 ? (
                    company.employees.map((employee) => (
                      <Link
                        key={employee._id}
                        href={`/employee/${employee._id}`}
                        className="block"
                      >
                        <Card className="bg-zinc-800 border-zinc-700 hover:border-teal-500/50 transition">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
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
                                <h3 className="font-medium text-white">
                                  {employee.name}
                                </h3>
                                <p className="text-sm text-zinc-300">
                                  {employee.position}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        No Employees Yet
                      </h3>
                      <p className="text-zinc-400 mb-4">
                        Add team members to start collaborating
                      </p>
                      <Button
                        onClick={() =>
                          router.push(`/company/${id}/new-employee`)
                        }
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Employee
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Clients</CardTitle>
                  <Button
                    onClick={() => router.push(`/company/${id}/newclient`)}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.clients.length > 0 ? (
                    company.clients.map((client, index) => (
                      <Card
                        key={index}
                        className="bg-zinc-800 border-zinc-700 hover:border-teal-500/50 transition"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              {client.imageUrl ? (
                                <AvatarImage
                                  src={client.imageUrl}
                                  alt={client.name}
                                />
                              ) : (
                                <AvatarFallback className="bg-violet-500 text-white">
                                  {client.name
                                    ? client.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                    : "C"}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-white">
                                {client.name}
                              </h3>
                              <p className="text-sm text-zinc-300">
                                {client.company}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 space-y-1 text-sm">
                            <p className="flex items-center gap-2 text-zinc-300">
                              <Mail className="h-4 w-4 text-zinc-400" />
                              {client.email}
                            </p>
                            <p className="flex items-center gap-2 text-zinc-300">
                              <Phone className="h-4 w-4 text-zinc-400" />
                              {client.phone}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <User className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        No Clients Yet
                      </h3>
                      <p className="text-zinc-400 mb-4">
                        Add clients to start tracking your business
                        relationships
                      </p>
                      <Button
                        onClick={() => router.push(`/company/${id}/newclient`)}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Client
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CompanyPage;
