"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface Employee {
  _id: string;
  name: string;
  position: string;
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

interface Job {
  _id: string;
  title: string;
  description: string;
  location: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
  startDate: string;
  endDate: string;
  status: "active" | "finished" | "on-hold" | "cancelled";
  progress?: number;
  assignedEmployees: string[];
  clientId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    company?: string;
  } | null;
}

const CompanyJobs = () => {
  const router = useRouter();
  const { id: companyId } = useParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState<string>("all");
  const [, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState("active");

  // Fetch jobs, employees, and clients
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch jobs
        const jobsRes = await fetch(`/api/public/job?companyId=${companyId}`);
        const jobsData = await jobsRes.json();

        if (!jobsRes.ok)
          throw new Error(jobsData.error || "Failed to fetch jobs");

        // Add progress field if missing
        const jobsWithProgress = (jobsData.jobs || []).map((job: Job) => ({
          ...job,
          progress: job.progress || Math.floor(Math.random() * 100),
        }));

        setJobs(jobsWithProgress);
        setFilteredJobs(jobsWithProgress);

        // Fetch employees
        const employeesRes = await fetch(
          `/api/employee?companyId=${companyId}`
        );
        if (employeesRes.ok) {
          const employeesData = await employeesRes.json();
          setEmployees(employeesData.employees || []);
        }

        // Fetch clients
        const clientsRes = await fetch(`/api/client?companyId=${companyId}`);
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData.clients || []);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        toast.error("Failed to load jobs data.");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [companyId]);

  // Filter jobs based on search term and status filter
  useEffect(() => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term) ||
          job.location.city.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Apply tab filter
    if (activeTab === "active") {
      filtered = filtered.filter((job) => job.status === "active");
    } else if (activeTab === "finished") {
      filtered = filtered.filter((job) => job.status === "finished");
    } else if (activeTab === "on-hold") {
      filtered = filtered.filter(
        (job) => job.status === "on-hold" || job.status === "cancelled"
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, activeTab, jobs]);

  // Handle job update
  const handleUpdateJob = async () => {
    if (!selectedJob) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob._id,
          updatedData: selectedJob,
        }),
      });

      if (!response.ok) throw new Error("Failed to update job");

      toast.success("Job updated successfully!");
      setJobs(
        jobs.map((job) => (job._id === selectedJob._id ? selectedJob : job))
      );
    } catch (error) {
      console.error("❌ Error updating job:", error);
      toast.error("Error updating job.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    setDeleting(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob._id }),
      });

      if (!response.ok) throw new Error("Failed to delete job");

      toast.success("Job deleted successfully!");
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
      setFilteredJobs(
        filteredJobs.filter((job) => job._id !== selectedJob._id)
      );
      setSelectedJob(null);
    } catch (error) {
      console.error("❌ Error deleting job:", error);
      toast.error("Error deleting job.");
    } finally {
      setDeleting(false);
    }
  };

  // Handle date changes in the edit modal
  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    if (date && selectedJob) {
      setSelectedJob({
        ...selectedJob,
        [field]: date.toISOString().split("T")[0],
      });
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500 text-blue-50";
      case "finished":
        return "bg-emerald-500 text-emerald-50";
      case "on-hold":
        return "bg-amber-500 text-amber-50";
      case "cancelled":
        return "bg-red-500 text-red-50";
      default:
        return "bg-zinc-500 text-zinc-50";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.warn(`Invalid date string: ${dateString}`, error);
      return "Invalid date";
    }
  };

  // Get client name
  const getClientName = (job: Job) => {
    if (!job.clientId) return "No client assigned";
    return job.clientId.firstName && job.clientId.lastName
      ? `${job.clientId.firstName} ${job.clientId.lastName}`
      : job.clientId.company || "Unknown client";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-2 bg-zinc-900 border-zinc-800 p-3 rounded-md">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-9 bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-white"
          onClick={() => router.push(`/company/${companyId}/newproject`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-zinc-800 border border-zinc-700 p-0.5">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-zinc-900"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="finished"
            className="data-[state=active]:bg-zinc-900"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="on-hold"
            className="data-[state=active]:bg-zinc-900"
          >
            On Hold
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-900">
            All Projects
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="mt-6">
          {filteredJobs.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Briefcase className="h-16 w-16 text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No Projects Found
                </h3>
                <p className="text-zinc-400 max-w-md mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "No projects match your current filters. Try adjusting your search criteria."
                    : "You don't have any projects yet. Create your first project to get started."}
                </p>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() =>
                    router.push(`/company/${companyId}/newproject`)
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job._id}
                  className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg text-white">
                            {job.title}
                          </h3>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-teal-400" />
                            <span>
                              {formatDate(job.startDate)} -{" "}
                              {formatDate(job.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-teal-400" />
                            <span>{job.location.city},</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-teal-400" />
                            <span>{getClientName(job)}</span>
                          </div>
                        </div>

                        {job.description && (
                          <p className="text-sm text-zinc-500 line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 w-full md:w-1/3">
                        <div className="flex gap-2 mt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 hover:bg-zinc-800"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-white">
                                  {job.title}
                                </DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                  Project details and information
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(job.status)}>
                                    {job.status.charAt(0).toUpperCase() +
                                      job.status.slice(1)}
                                  </Badge>
                                  <span className="text-zinc-400">
                                    {formatDate(job.startDate)} -{" "}
                                    {formatDate(job.endDate)}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium text-white">
                                    Description
                                  </h4>
                                  <p className="text-zinc-400">
                                    {job.description ||
                                      "No description provided."}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium text-white">
                                    Location
                                  </h4>
                                  <p className="text-zinc-400">
                                    {job.location.street}, {job.location.city},{" "}
                                    {job.location.stateOrProvince},{" "}
                                    {job.location.postalCodeOrZip},{" "}
                                    {job.location.country}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium text-white">
                                    Client
                                  </h4>
                                  <p className="text-zinc-400">
                                    {getClientName(job)}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-teal-500 hover:bg-teal-600 text-white"
                                onClick={() => setSelectedJob(job)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-white">
                                  Edit Project
                                </DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                  Make changes to the project details
                                </DialogDescription>
                              </DialogHeader>

                              {selectedJob && (
                                <div className="space-y-6 py-4">
                                  {/* Project Details */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                      <Briefcase className="h-5 w-5 text-teal-400" />
                                      Project Details
                                    </h3>

                                    <div className="space-y-4">
                                      <div className="grid gap-2">
                                        <label
                                          htmlFor="title"
                                          className="text-sm font-medium text-zinc-400"
                                        >
                                          Project Title{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <Input
                                          id="title"
                                          value={selectedJob.title}
                                          onChange={(e) =>
                                            setSelectedJob({
                                              ...selectedJob,
                                              title: e.target.value,
                                            })
                                          }
                                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                          required
                                        />
                                      </div>

                                      <div className="grid gap-2">
                                        <label
                                          htmlFor="description"
                                          className="text-sm font-medium text-zinc-400"
                                        >
                                          Project Description
                                        </label>
                                        <Textarea
                                          id="description"
                                          value={selectedJob.description}
                                          onChange={(e) =>
                                            setSelectedJob({
                                              ...selectedJob,
                                              description: e.target.value,
                                            })
                                          }
                                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500 min-h-[120px]"
                                        />
                                      </div>

                                      <div className="grid gap-2">
                                        <label
                                          htmlFor="status"
                                          className="text-sm font-medium text-zinc-400"
                                        >
                                          Status{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <Select
                                          value={selectedJob.status}
                                          onValueChange={(value) =>
                                            setSelectedJob({
                                              ...selectedJob,
                                              status: value as
                                                | "active"
                                                | "finished"
                                                | "on-hold"
                                                | "cancelled",
                                            })
                                          }
                                        >
                                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-zinc-800 border-zinc-700">
                                            <SelectItem value="active">
                                              Active
                                            </SelectItem>
                                            <SelectItem value="finished">
                                              Finished
                                            </SelectItem>
                                            <SelectItem value="on-hold">
                                              On Hold
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                              Cancelled
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-zinc-800" />

                                  {/* Project Timeline */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                      <Clock className="h-5 w-5 text-teal-400" />
                                      Project Timeline
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">
                                          Start Date{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className={cn(
                                                "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700",
                                                !selectedJob.startDate &&
                                                  "text-zinc-500"
                                              )}
                                            >
                                              <Calendar className="mr-2 h-4 w-4" />
                                              {selectedJob.startDate
                                                ? format(
                                                    new Date(
                                                      selectedJob.startDate
                                                    ),
                                                    "PPP"
                                                  )
                                                : "Select start date"}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700">
                                            <CalendarComponent
                                              mode="single"
                                              selected={
                                                selectedJob.startDate
                                                  ? new Date(
                                                      selectedJob.startDate
                                                    )
                                                  : undefined
                                              }
                                              onSelect={(date) =>
                                                handleDateChange(
                                                  "startDate",
                                                  date
                                                )
                                              }
                                              initialFocus
                                              className="bg-zinc-800 text-white"
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">
                                          End Date{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className={cn(
                                                "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700",
                                                !selectedJob.endDate &&
                                                  "text-zinc-500"
                                              )}
                                            >
                                              <Calendar className="mr-2 h-4 w-4" />
                                              {selectedJob.endDate
                                                ? format(
                                                    new Date(
                                                      selectedJob.endDate
                                                    ),
                                                    "PPP"
                                                  )
                                                : "Select end date"}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700">
                                            <CalendarComponent
                                              mode="single"
                                              selected={
                                                selectedJob.endDate
                                                  ? new Date(
                                                      selectedJob.endDate
                                                    )
                                                  : undefined
                                              }
                                              onSelect={(date) =>
                                                handleDateChange(
                                                  "endDate",
                                                  date
                                                )
                                              }
                                              initialFocus
                                              className="bg-zinc-800 text-white"
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-zinc-800" />

                                  {/* Project Location */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                      <MapPin className="h-5 w-5 text-teal-400" />
                                      Project Location
                                    </h3>

                                    <div className="grid gap-4">
                                      <div className="grid gap-2">
                                        <label
                                          htmlFor="location.street"
                                          className="text-sm font-medium text-zinc-400"
                                        >
                                          Street Address{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <Input
                                          id="location.street"
                                          value={selectedJob.location.street}
                                          onChange={(e) =>
                                            setSelectedJob({
                                              ...selectedJob,
                                              location: {
                                                ...selectedJob.location,
                                                street: e.target.value,
                                              },
                                            })
                                          }
                                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                          required
                                        />
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <label
                                            htmlFor="location.city"
                                            className="text-sm font-medium text-zinc-400"
                                          >
                                            City{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <Input
                                            id="location.city"
                                            value={selectedJob.location.city}
                                            onChange={(e) =>
                                              setSelectedJob({
                                                ...selectedJob,
                                                location: {
                                                  ...selectedJob.location,
                                                  city: e.target.value,
                                                },
                                              })
                                            }
                                            className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                            required
                                          />
                                        </div>

                                        <div className="grid gap-2">
                                          <label
                                            htmlFor="location.stateOrProvince"
                                            className="text-sm font-medium text-zinc-400"
                                          >
                                            State/Province{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <Input
                                            id="location.stateOrProvince"
                                            value={
                                              selectedJob.location
                                                .stateOrProvince
                                            }
                                            onChange={(e) =>
                                              setSelectedJob({
                                                ...selectedJob,
                                                location: {
                                                  ...selectedJob.location,
                                                  stateOrProvince:
                                                    e.target.value,
                                                },
                                              })
                                            }
                                            className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                            required
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <label
                                            htmlFor="location.postalCodeOrZip"
                                            className="text-sm font-medium text-zinc-400"
                                          >
                                            Postal Code{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <Input
                                            id="location.postalCodeOrZip"
                                            value={
                                              selectedJob.location
                                                .postalCodeOrZip
                                            }
                                            onChange={(e) =>
                                              setSelectedJob({
                                                ...selectedJob,
                                                location: {
                                                  ...selectedJob.location,
                                                  postalCodeOrZip:
                                                    e.target.value,
                                                },
                                              })
                                            }
                                            className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                            required
                                          />
                                        </div>

                                        <div className="grid gap-2">
                                          <label
                                            htmlFor="location.country"
                                            className="text-sm font-medium text-zinc-400"
                                          >
                                            Country{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <Input
                                            id="location.country"
                                            value={selectedJob.location.country}
                                            onChange={(e) =>
                                              setSelectedJob({
                                                ...selectedJob,
                                                location: {
                                                  ...selectedJob.location,
                                                  country: e.target.value,
                                                },
                                              })
                                            }
                                            className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-zinc-800" />

                                  {/* Client Information */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                      <Users className="h-5 w-5 text-teal-400" />
                                      Client Information
                                    </h3>

                                    <div className="grid gap-2">
                                      <label className="text-sm font-medium text-zinc-400">
                                        Select Client{" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <Select
                                        value={selectedJob.clientId?._id || ""}
                                        onValueChange={(value) =>
                                          setSelectedJob({
                                            ...selectedJob,
                                            clientId: { _id: value },
                                          })
                                        }
                                      >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                          <SelectValue placeholder="Choose a client" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                          {clients.length > 0 ? (
                                            clients.map((client) => (
                                              <SelectItem
                                                key={client._id}
                                                value={client._id}
                                                className="focus:bg-zinc-700"
                                              >
                                                {client.firstName}{" "}
                                                {client.lastName}{" "}
                                                {client.company
                                                  ? `(${client.company})`
                                                  : ""}
                                              </SelectItem>
                                            ))
                                          ) : (
                                            <div className="p-2 text-zinc-400 text-center">
                                              No clients available
                                            </div>
                                          )}
                                        </SelectContent>
                                      </Select>
                                      {clients.length === 0 && (
                                        <p className="text-amber-400 text-sm mt-1">
                                          No clients found. Please add a client
                                          first.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
                                <Button
                                  variant="destructive"
                                  className="w-full sm:w-auto"
                                  disabled={deleting}
                                  onClick={handleDeleteJob}
                                >
                                  {deleting ? (
                                    <>
                                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-zinc-700 border-t-white"></div>
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Project
                                    </>
                                  )}
                                </Button>
                                <Button
                                  type="submit"
                                  className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white"
                                  disabled={updating}
                                  onClick={handleUpdateJob}
                                >
                                  {updating ? (
                                    <>
                                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-zinc-700 border-t-white"></div>
                                      Updating...
                                    </>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-zinc-900 border-zinc-800"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              <DropdownMenuItem
                                className="text-zinc-400 focus:text-white focus:bg-zinc-800"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setSelectedJob({
                                    ...job,
                                    progress: 100,
                                    status: "finished",
                                  });
                                  setTimeout(() => {
                                    handleUpdateJob();
                                  }, 100);
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Mark as Completed</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-400 focus:bg-zinc-800"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setTimeout(() => {
                                    handleDeleteJob();
                                  }, 100);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Project</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyJobs;
