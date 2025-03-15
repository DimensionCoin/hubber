"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/providers/UserProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, MapPin, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import UpgradePlan from "@/components/shared/UpgradePlan";

const businessTypes = [
  "construction",
  "media",
  "landscaping",
  "retail",
  "technology",
  "manufacturing",
  "finance",
  "healthcare",
  "education",
  "other",
];

interface AddressSuggestion {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export default function CreateCompanyForm() {
  const { tier, companyCount } = useUserContext();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    businessType: "",
    address: {
      street: "",
      city: "",
      stateOrProvince: "",
      postalCodeOrZip: "",
      country: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressInput, setAddressInput] = useState(""); // Keeps input field text separate

  const tierLimits: Record<string, number> = {
    free: 1,
    basic: 1,
    premium: 10,
  };

  const canCreateCompany = companyCount < (tierLimits[tier] || 0);

  // Handle Address Autocomplete Suggestions
  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddressInput(e.target.value); // Update input field separately

    if (e.target.value.length > 3) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}&addressdetails=1`
      );
      const data: AddressSuggestion[] = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  // When user selects an address from dropdown
  const handleSelectAddress = (place: AddressSuggestion) => {
    const streetAddress = `${
      place.address.house_number ? place.address.house_number + " " : ""
    }${place.address.road || ""}`.trim();

    setForm({
      ...form,
      address: {
        street: streetAddress,
        city: place.address.city || "",
        stateOrProvince: place.address.state || "",
        postalCodeOrZip: place.address.postcode || "",
        country: place.address.country || "",
      },
    });

    setAddressInput(streetAddress); // Update input field text
    setSuggestions([]); // Clear suggestions
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name === "city") {
      setForm({
        ...form,
        address: {
          ...form.address,
          city: value,
        },
      });
    } else if (name === "stateOrProvince") {
      setForm({
        ...form,
        address: {
          ...form.address,
          stateOrProvince: value,
        },
      });
    } else if (name === "postalCodeOrZip") {
      setForm({
        ...form,
        address: {
          ...form.address,
          postalCodeOrZip: value,
        },
      });
    } else if (name === "country") {
      setForm({
        ...form,
        address: {
          ...form.address,
          country: value,
        },
      });
    } else {
      // Handle regular fields
      setForm({ ...form, [name]: value });
    }
  };

  const handleBusinessTypeChange = (value: string) => {
    setForm({ ...form, businessType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Validation: Ensure all required fields are filled
    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.businessType ||
      !form.address.street ||
      !form.address.city ||
      !form.address.stateOrProvince ||
      !form.address.postalCodeOrZip ||
      !form.address.country
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // ✅ Ensure new company contains employees, revenue, and status fields
    const companyData = {
      ...form,
      employees: [], // ✅ Default empty array
      totalRevenue: 0, // ✅ Default revenue is 0
      status: "active", // ✅ Default status is active
    };

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData), // ✅ Now sending additional fields
      });

      if (!response.ok) throw new Error("Failed to create company");

      toast.success("Company created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error creating company.");
    } finally {
      setLoading(false);
    }
  };

  if (!canCreateCompany) {
    return <UpgradePlan title="Your Tier Doesn't Allow More Than 1 Company" />;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 text-zinc-400 hover:text-white"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-teal-500 text-white hover:bg-teal-600">
              New Company
            </Badge>
            <Badge className="bg-zinc-700 text-zinc-200">
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Create a New Company
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Add a new company to your dashboard. You can create{" "}
            {tierLimits[tier]}{" "}
            {tierLimits[tier] === 1 ? "company" : "companies"} on your current
            plan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-teal-400" />
                Company Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    onValueChange={handleBusinessTypeChange}
                    value={form.businessType}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {businessTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="focus:bg-zinc-700"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-400" />
                Company Address
              </h3>

              <div className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={addressInput}
                    onChange={handleAddressChange}
                    placeholder="Start typing your address..."
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />

                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-zinc-800 rounded-lg p-2 max-h-40 overflow-auto border border-zinc-700 shadow-lg">
                      {suggestions.map((place, index) => (
                        <li
                          key={index}
                          className="cursor-pointer p-2 hover:bg-zinc-700 text-zinc-300 text-sm rounded"
                          onClick={() => handleSelectAddress(place)}
                        >
                          {place.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={form.address.city}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="stateOrProvince"
                      className="block text-sm font-medium text-zinc-400 mb-1"
                    >
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="stateOrProvince"
                      name="stateOrProvince"
                      value={form.address.stateOrProvince}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCodeOrZip"
                      className="block text-sm font-medium text-zinc-400 mb-1"
                    >
                      Postal Code / Zip <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="postalCodeOrZip"
                      name="postalCodeOrZip"
                      value={form.address.postalCodeOrZip}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="country"
                    name="country"
                    value={form.address.country}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-zinc-700 hover:bg-zinc-800 text-zinc-400"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white"
            disabled={loading || !canCreateCompany}
            onClick={handleSubmit}
          >
            {loading ? "Creating..." : "Create Company"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
