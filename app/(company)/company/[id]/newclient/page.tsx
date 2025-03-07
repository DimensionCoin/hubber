"use client";

import type React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, User, Mail, MapPin, ArrowLeft, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

const NewClient = () => {
  const { id: companyId } = useParams();
  const router = useRouter();
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: {
      street: "",
      city: "",
      postalCodeOrZip: "",
    },
    images: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setClientData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setClientData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form before submitting
  const isFormValid = () => {
    return (
      clientData.firstName.trim() &&
      clientData.lastName.trim() &&
      clientData.email.trim() &&
      clientData.phone.trim() &&
      clientData.address.street.trim() &&
      clientData.address.city.trim() &&
      clientData.address.postalCodeOrZip.trim()
    );
  };

  // Submit client creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, clientData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add client");
      }

      toast.success("Client added successfully!");
      router.push(`/company/${companyId}`);
    } catch (error) {
      // Changed 'err' to 'error' and used it
      toast.error(
        error instanceof Error ? error.message : "Failed to add client"
      );
    } finally {
      setLoading(false);
    }
  };

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
              New Client
            </Badge>
            <Badge className="bg-zinc-700 text-zinc-200">Customer</Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Add New Client
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Add a new client to your company&apos;s database
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <User className="h-5 w-5 text-teal-400" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-zinc-400"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={clientData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-zinc-400"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={clientData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-teal-400" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-400"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={clientData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-zinc-400"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={clientData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Company Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-teal-400" />
                Company Information
              </h3>

              <div className="grid gap-2">
                <label
                  htmlFor="company"
                  className="text-sm font-medium text-zinc-400"
                >
                  Company Name <span className="text-zinc-500">(Optional)</span>
                </label>
                <Input
                  id="company"
                  name="company"
                  value={clientData.company}
                  onChange={handleInputChange}
                  placeholder="Enter company name (if applicable)"
                  className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                />
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-400" />
                Address Information
              </h3>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="address.street"
                    className="text-sm font-medium text-zinc-400"
                  >
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="address.street"
                    name="address.street"
                    value={clientData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="address.city"
                      className="text-sm font-medium text-zinc-400"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="address.city"
                      name="address.city"
                      value={clientData.address.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="address.postalCodeOrZip"
                      className="text-sm font-medium text-zinc-400"
                    >
                      Postal Code / ZIP <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="address.postalCodeOrZip"
                      name="address.postalCodeOrZip"
                      value={clientData.address.postalCodeOrZip}
                      onChange={handleInputChange}
                      placeholder="Enter postal code or ZIP"
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                      required
                    />
                  </div>
                </div>
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
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-zinc-700 border-t-white"></div>
                Adding Client...
              </>
            ) : (
              <>
                Add Client
                <Plus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewClient;
