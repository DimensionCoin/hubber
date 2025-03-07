"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Users,
  Building,
  ArrowLeft,
  Briefcase,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Employee {
  _id: string;
  name: string;
}

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  company?: string;
}

interface Company {
  _id: string;
  name: string;
  businessType: string;
  email: string;
  phone: string;
  employees: Employee[];
  clients: Client[];
  totalRevenue: number;
  status: string;
  companyUrl: string;
  createdAt: string;
  address: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
}

const NewProject = () => {
  const { id: companyId } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: {
      street: "",
      city: "",
      stateOrProvince: "",
      postalCodeOrZip: "",
      country: "",
    },
    status: "active",
    assignedEmployees: [] as string[],
    clientId: "", // Store selected client
  });

  useEffect(() => {
    if (!companyId || companyId === "undefined") {
      console.error("❌ Missing companyId in URL");
      setLoading(false);
      return;
    }

    async function fetchCompany() {
      try {
        const res = await fetch(`/api/public/company?companyId=${companyId}`);
        if (!res.ok) throw new Error("Failed to fetch company");

        const data: Company = await res.json();
        setCompany(data);
      } catch (error) {
        console.error("❌ Error fetching company:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    }

    async function fetchClients() {
      try {
        const res = await fetch(`/api/client?companyId=${companyId}`);
        if (!res.ok) throw new Error("Failed to fetch clients");

        const data = await res.json();
        setClients(data.clients || []);
      } catch (error) {
        console.error("❌ Error fetching clients:", error);
        setClients([]);
      }
    }

    fetchCompany();
    fetchClients();
  }, [companyId]);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setJobForm((prev) => ({
        ...prev,
        location: { ...prev.location, [locationField]: value },
      }));
    } else {
      setJobForm({ ...jobForm, [name]: value });
    }
  };

  // Handle Date Changes
  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    if (date) {
      setJobForm((prev) => ({
        ...prev,
        [field]: date.toISOString().split("T")[0],
      }));
    }
  };

  // Handle Job Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("🚀 Job Form Submitted:", jobForm);

    // Validation: Ensure all required fields are filled
    if (
      !jobForm.title ||
      !jobForm.startDate ||
      !jobForm.endDate ||
      !jobForm.clientId ||
      !jobForm.location.street ||
      !jobForm.location.city ||
      !jobForm.location.stateOrProvince ||
      !jobForm.location.postalCodeOrZip ||
      !jobForm.location.country
    ) {
      toast.error("Please fill in all required fields.");
      console.error("❌ Missing required fields:", jobForm);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          title: jobForm.title,
          description: jobForm.description,
          startDate: jobForm.startDate,
          endDate: jobForm.endDate,
          location: jobForm.location,
          status: jobForm.status,
          assignedEmployees: jobForm.assignedEmployees,
          clientId: jobForm.clientId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Response Error:", errorText);
        throw new Error("Failed to create job");
      }

      toast.success("Job created successfully!");
      router.push(`/company/${companyId}`);
    } catch (error) {
      console.error("❌ Error creating job:", error);
      toast.error("Error creating job.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-400">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
        <div className="text-center py-8">
          <Building className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Company Not Found
          </h2>
          <p className="text-zinc-300 text-center mb-4">
            We couldn&apos;t find the company you&apos;re looking for. It may
            have been removed or you may not have access.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 text-zinc-400 hover:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-teal-500 text-white hover:bg-teal-600">
              New Project
            </Badge>
            <Badge className="bg-zinc-700 text-zinc-200">
              {company.businessType}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Create New Project
          </CardTitle>
          <CardDescription className="text-zinc-400 flex items-center gap-2">
            <Building className="h-4 w-4 text-teal-400" />
            {company.name}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter project title"
                    value={jobForm.title}
                    onChange={handleChange}
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
                    name="description"
                    placeholder="Describe the project details, goals, and requirements"
                    value={jobForm.description}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500 min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-400" />
                Project Timeline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700",
                          !jobForm.startDate && "text-zinc-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {jobForm.startDate
                          ? format(new Date(jobForm.startDate), "PPP")
                          : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700">
                      <Calendar
                        mode="single"
                        selected={
                          jobForm.startDate
                            ? new Date(jobForm.startDate)
                            : undefined
                        }
                        onSelect={(date: Date | undefined) => handleDateChange("startDate", date)}
                        initialFocus
                        className="bg-zinc-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700",
                          !jobForm.endDate && "text-zinc-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {jobForm.endDate
                          ? format(new Date(jobForm.endDate), "PPP")
                          : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700">
                      <Calendar
                        mode="single"
                        selected={
                          jobForm.endDate
                            ? new Date(jobForm.endDate)
                            : undefined
                        }
                        onSelect={(date: Date | undefined) => handleDateChange("endDate", date)}
                        initialFocus
                        className="bg-zinc-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

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
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="location.street"
                    name="location.street"
                    placeholder="Enter street address"
                    value={jobForm.location.street}
                    onChange={handleChange}
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
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="location.city"
                      name="location.city"
                      placeholder="Enter city"
                      value={jobForm.location.city}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="location.stateOrProvince"
                      className="text-sm font-medium text-zinc-400"
                    >
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="location.stateOrProvince"
                      name="location.stateOrProvince"
                      placeholder="Enter state or province"
                      value={jobForm.location.stateOrProvince}
                      onChange={handleChange}
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
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="location.postalCodeOrZip"
                      name="location.postalCodeOrZip"
                      placeholder="Enter postal code"
                      value={jobForm.location.postalCodeOrZip}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="location.country"
                      className="text-sm font-medium text-zinc-400"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="location.country"
                      name="location.country"
                      placeholder="Enter country"
                      value={jobForm.location.country}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-400" />
                Client Information
              </h3>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-400">
                  Select Client <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(value) =>
                    setJobForm({ ...jobForm, clientId: value })
                  }
                  value={jobForm.clientId}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:ring-teal-500">
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
                          {client.firstName} {client.lastName}{" "}
                          {client.company ? `(${client.company})` : ""}
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
                    No clients found. Please add a client first.
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-zinc-700 hover:bg-zinc-800 text-zinc-400"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-zinc-700 border-t-white"></div>
                Creating Project...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewProject;
