"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Phone,
  MapPin,
  Mail,
  SearchIcon,
  Tag,
  Filter,
  ArrowUpRight,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define company interface to match API response
interface Company {
  id: string; // Maps to _id from API
  publicId: string; // Maps to publicId from API
  name: string;
  address: string; // We'll construct this from API's address object
  city: string;
  state: string;
  phone: string;
  email: string;
  employees: number; // Derived from employees array or default to 0
  revenue: string; // Maps to totalRevenue, formatted as string
  tags: string[]; // Derived from businessType or empty
  businessType: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all companies from API on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/companies?all=true", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch companies");

        const data = await response.json();
        // Map API data to Company interface
        const mappedCompanies: Company[] = data.map((company: any) => ({
          id: company._id,
          publicId: company.publicId || "missing-public-id", // Ensure publicId is included
          name: company.name,
          address: company.address.street,
          city: company.address.city,
          state: company.address.stateOrProvince,
          phone: company.phone,
          email: company.email,
          employees: company.employees?.length || 0,
          revenue: `$${Number(company.totalRevenue).toLocaleString()}`,
          tags: company.businessType
            ? [company.businessType.toLowerCase()]
            : [],
          businessType: company.businessType || "Unknown",
        }));

        setCompanies(mappedCompanies);
        setFilteredCompanies(mappedCompanies); // Initial filtered list
      } catch (error) {
        console.error("❌ Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  // Filter companies based on search term, selected tags, and active tab
  useEffect(() => {
    let filtered = companies;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(term) ||
          company.businessType.toLowerCase().includes(term) ||
          company.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((company) =>
        selectedTags.some((tag) => company.tags.includes(tag))
      );
    }

    // Filter by business type tab
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (company) => company.businessType.toLowerCase() === activeTab
      );
    }

    setFilteredCompanies(filtered);
  }, [searchTerm, selectedTags, activeTab, companies]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all selected tags
  const clearTags = () => {
    setSelectedTags([]);
  };

  // Get unique business types and tags for filters
  const businessTypes = Array.from(
    new Set(companies.map((company) => company.businessType.toLowerCase()))
  );
  const allTags = Array.from(
    new Set(companies.flatMap((company) => company.tags))
  );

  return (
    <div className="container mx-auto p-4 space-y-4 mb-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Company Search</h1>
          <p className="text-zinc-400">
            Find and explore companies in our database
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-white">
            Search Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search by name, business type, or tags..."
                className="pl-9 bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`border-zinc-700 hover:bg-zinc-800 ${
                    selectedTags.length > 0
                      ? "bg-teal-500/20 border-teal-500"
                      : ""
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {selectedTags.length > 0 && (
                    <Badge className="ml-2 bg-teal-500 text-white">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-zinc-900 border-zinc-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Filter by Tags</h4>
                    {selectedTags.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearTags}
                        className="h-8 px-2 text-xs text-zinc-400 hover:text-white"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        className={`cursor-pointer ${
                          selectedTags.includes(tag)
                            ? "bg-teal-500 hover:bg-teal-600"
                            : "bg-zinc-800 hover:bg-zinc-700"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="pt-2 border-t border-zinc-800">
                      <p className="text-sm text-zinc-400">Selected filters:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-teal-500 hover:bg-teal-600"
                          >
                            {tag}
                            <button
                              className="ml-1 hover:text-zinc-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTag(tag);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end pt-2">
                    <Button
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Show selected tags summary if any */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-400">Active filters:</span>
              {selectedTags.map((tag) => (
                <Badge key={tag} className="bg-teal-500 hover:bg-teal-600">
                  {tag}
                  <button
                    className="ml-1 hover:text-zinc-200"
                    onClick={() => toggleTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTags}
                className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Type Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-zinc-800 border border-zinc-700 p-0.5 mb-4 inline-flex w-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-zinc-900"
            >
              All
            </TabsTrigger>
            {businessTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="data-[state=active]:bg-zinc-900"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Companies Grid */}
        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Building className="h-16 w-16 text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Loading Companies
                </h3>
                <p className="text-zinc-400 max-w-md">
                  Fetching company data from the database...
                </p>
              </CardContent>
            </Card>
          ) : filteredCompanies.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Building className="h-16 w-16 text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No Companies Found
                </h3>
                <p className="text-zinc-400 max-w-md mb-6">
                  We couldn't find any companies matching your search criteria.
                  Try adjusting your filters or search term.
                </p>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTags([]);
                    setActiveTab("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/search/${company.publicId}`} // Updated to use publicId
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
                      <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 mt-2">
                        {company.businessType}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-zinc-400">
                          <MapPin className="w-4 h-4 mr-2 text-teal-400 shrink-0" />
                          <span className="text-sm truncate">
                            {company.address}, {company.city}, {company.state}
                          </span>
                        </div>
                        <div className="flex items-center text-zinc-400">
                          <Phone className="w-4 h-4 mr-2 text-teal-400 shrink-0" />
                          <span className="text-sm">{company.phone}</span>
                        </div>
                        <div className="flex items-center text-zinc-400">
                          <Mail className="w-4 h-4 mr-2 text-teal-400 shrink-0" />
                          <span className="text-sm truncate">
                            {company.email}
                          </span>
                        </div>
                      </div>
                      {/* Hidden tags for search functionality */}
                      <div className="hidden">
                        {company.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
