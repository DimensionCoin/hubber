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
    setForm({ ...form, [e.target.name]: e.target.value });
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
    return <UpgradePlan title="Your Tier Doesn’t Allow More Than 1 Company" />;
  }


  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">
        Create a New Company
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-white">
          Company Name
        </label>
        <Input name="name" value={form.name} onChange={handleChange} required />

        <label className="block text-sm font-medium text-white">Email</label>
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="block text-sm font-medium text-white">
          Phone Number
        </label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label className="block text-sm font-medium text-white">
          Business Type
        </label>
        <Select onValueChange={handleBusinessTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a business type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="block text-sm font-medium text-white">Address</label>
        <Input
          name="address"
          value={addressInput} // ✅ Only displays street address
          onChange={handleAddressChange}
          placeholder="Start typing your address..."
          required
        />

        {suggestions.length > 0 && (
          <ul className="bg-zinc-800 rounded-lg mt-2 p-2 max-h-40 overflow-auto">
            {suggestions.map((place, index) => (
              <li
                key={index}
                className="cursor-pointer p-2 hover:bg-zinc-700 text-white"
                onClick={() => handleSelectAddress(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}

        <label className="block text-sm font-medium text-white">City</label>
        <Input
          name="city"
          value={form.address.city}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">
              State/Province
            </label>
            <Input
              name="stateOrProvince"
              value={form.address.stateOrProvince}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Postal Code / Zip
            </label>
            <Input
              name="postalCodeOrZip"
              value={form.address.postalCodeOrZip}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label className="block text-sm font-medium text-white">Country</label>
        <Input
          name="country"
          value={form.address.country}
          onChange={handleChange}
          required
        />

        {!canCreateCompany && (
          <div className="mb-4 p-3 bg-red-500 text-white text-center rounded">
            You have reached your company limit for your current subscription
            tier.
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-400"
          disabled={loading || !canCreateCompany}
        >
          {loading ? "Creating..." : "Create Company"}
        </Button>
      </form>
    </div>
  );
}
