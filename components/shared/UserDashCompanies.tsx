"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Building,
  MapPin,
  Search,
  Calendar,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Company {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
  employees: { _id: string }[];
  totalRevenue: number;
  status?: string;
  createdAt?: string;
  businessType?: string;
}

const UserDashCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Failed to fetch companies");

        const data = await response.json();

        // Add default values for optional fields if they don't exist
        const enhancedData = data.map((company: Company) => ({
          ...company,
          status: company.status || "active",
          createdAt: company.createdAt || new Date().toISOString(),
          businessType: company.businessType || "Business",
        }));

        setCompanies(enhancedData);
        setFilteredCompanies(enhancedData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Companies</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Takes more space */}
        <div className="relative flex-1 md:flex-[2] max-w-lg">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search for a company..."
            className="w-full pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add New Company Button - Icon on mobile, full button on md+ */}
        <div className="flex-shrink-0">
          <Link href="/create">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white w-10 h-10 md:w-auto md:px-4 flex items-center justify-center">
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Add New Company</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Display Companies or No Results Message */}
      {filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Building className="h-16 w-16 text-zinc-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No Companies Found
          </h3>
          <p className="text-zinc-400 max-w-md mb-6">
            {`We couldn't find any companies matching your search.`}
          </p>
          <Link href={"/create"}>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add New Company
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
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
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <p className="text-sm text-zinc-400">
                      {company.address.city}, {company.address.country}
                    </p>
                  </div>
                  {company.businessType && (
                    <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 mt-2">
                      {company.businessType}
                    </Badge>
                  )}
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
                        {formatCurrency(company.totalRevenue)}
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
                        <span className="text-sm text-zinc-400 capitalize">
                          {company.status}
                        </span>
                      </div>

                      {/* Active Since Date */}
                      {company.createdAt && (
                        <div className="flex items-center text-teal-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashCompanies;
