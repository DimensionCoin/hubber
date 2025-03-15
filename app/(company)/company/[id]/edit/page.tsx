"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building, Save, Trash2, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "sonner";

interface Company {
  _id: string;
  publicId: string;
  owner: string;
  name: string;
  logo?: string;
  description?: string;
  address: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  businessType: string;
  foundedYear?: number;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  services?: string[];
  images?: string[];
  testimonials?: {
    id: string;
    name: string;
    company: string;
    comment: string;
    rating: number;
    imageUrl?: string;
  }[];
  stats?: {
    employees: number;
    projectsCompleted: number;
    yearsInBusiness: number;
    clientSatisfaction: number;
  };
  tags?: string[];
  clients?: string[];
  employees?: string[];
  jobs?: string[];
  status: "active" | "inactive";
  companyUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const CompanyEditPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [newService, setNewService] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        setError("No valid company ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching company with ID:", id);
        const response = await fetch(`/api/company/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch response:", errorText);
          throw new Error(`Failed to fetch company: ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched company data:", data);
        setCompany(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company data");
        toast.error("Error", {
          description: "Failed to load company data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...(prev?.address || {}),
        [name]: value,
      } as Company["address"],
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const platform = name.split(".")[1]; // Extract platform from name (e.g., "socialMedia.facebook" -> "facebook")

    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...(prev?.socialMedia || {}),
        [platform]: value,
      },
    }));
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...(prev?.services || []), newService.trim()],
      }));
      setNewService(""); // Clear input
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev?.services || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev?.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl(""); // Clear input
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev?.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdate = async () => {
    if (!id) {
      toast.error("Error", {
        description: "No valid company ID provided",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/company/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update company: ${errorText}`);
      }

      const updatedCompany = await response.json();
      setCompany(updatedCompany);
      toast.success("Success", {
        description: "Company updated successfully!",
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error("Error", {
        description: "Failed to update company. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      toast.error("Error", {
        description: "No valid company ID provided",
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/company/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete company: ${errorText}`);
      }

      toast.success("Success", {
        description: "Company deleted successfully!",
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Error", {
        description: "Failed to delete company. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-300">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md">
          <Building className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Company Not Found
          </h2>
          <p className="text-zinc-300 text-center mb-4">
            {error || "We couldn't find the company you're looking for."}
          </p>
          <Button className="w-full" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="container mx-auto">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-white">
                Edit Company: {company.name}
              </CardTitle>
              <div className="space-x-2">
                <Button
                  onClick={handleUpdate}
                  className="bg-teal-500 hover:bg-teal-600"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            <CardDescription>
              <Badge className="mt-2 bg-teal-500 text-white">
                {company.businessType}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <div className="flex items-center gap-4 mt-2">
                {formData.logo ? (
                  <div className="relative h-16 w-16 rounded-md overflow-hidden border border-zinc-700">
                    <img
                      src={formData.logo || "/placeholder.svg"}
                      alt="Company logo"
                      className="object-cover h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Building className="h-8 w-8 text-zinc-500" />
                  </div>
                )}
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="street"
                  placeholder="Street"
                  value={formData.address?.street || ""}
                  onChange={handleAddressChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
                <Input
                  name="city"
                  placeholder="City"
                  value={formData.address?.city || ""}
                  onChange={handleAddressChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
                <Input
                  name="stateOrProvince"
                  placeholder="State/Province"
                  value={formData.address?.stateOrProvince || ""}
                  onChange={handleAddressChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
                <Input
                  name="postalCodeOrZip"
                  placeholder="Postal Code/ZIP"
                  value={formData.address?.postalCodeOrZip || ""}
                  onChange={handleAddressChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
                <Input
                  name="country"
                  placeholder="Country"
                  value={formData.address?.country || ""}
                  onChange={handleAddressChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <Label>Social Media</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="socialMedia.facebook"
                    value={formData.socialMedia?.facebook || ""}
                    onChange={handleSocialMediaChange}
                    className="bg-zinc-800 text-white border-zinc-700"
                    placeholder="https://facebook.com/yourcompany"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="socialMedia.twitter"
                    value={formData.socialMedia?.twitter || ""}
                    onChange={handleSocialMediaChange}
                    className="bg-zinc-800 text-white border-zinc-700"
                    placeholder="https://twitter.com/yourcompany"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia?.linkedin || ""}
                    onChange={handleSocialMediaChange}
                    className="bg-zinc-800 text-white border-zinc-700"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia?.instagram || ""}
                    onChange={handleSocialMediaChange}
                    className="bg-zinc-800 text-white border-zinc-700"
                    placeholder="https://instagram.com/yourcompany"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label>Services</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a service"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
                <Button onClick={handleAddService} variant="outline">
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.services || []).map((service, index) => (
                  <Badge
                    key={index}
                    className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center gap-1"
                  >
                    {service}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveService(index)}
                    >
                      <X className="h-3 w-3 text-red-400" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  name="foundedYear"
                  type="number"
                  value={formData.foundedYear || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  name="businessType"
                  value={formData.businessType || ""}
                  onChange={handleInputChange}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="bg-zinc-800 text-white border-zinc-700"
                />
                <Button onClick={handleAddImage} variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {(formData.images || []).map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-zinc-800 p-2 rounded-md"
                  >
                    <span className="text-zinc-300 truncate">{image}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || "active"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "active" | "inactive",
                  }))
                }
                className="bg-zinc-800 text-white border-zinc-700 rounded-md p-2 w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default CompanyEditPage;
