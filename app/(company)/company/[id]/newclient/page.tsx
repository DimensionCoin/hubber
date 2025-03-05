"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const NewClient = () => {
  const { id } = useParams(); // Use 'id' to match folder [id]
  const router = useRouter();
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postalCodeOrZip: "",
    },
    company: "",
    images: [] as string[],
  });
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleImageAdd = () => {
    if (imageInput.trim()) {
      setClientData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const handleImageRemove = (index: number) => {
    setClientData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: id, clientData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add client");
      }

      router.push(`/company/${id}`);
    } catch (err: unknown) {
      // Changed to 'unknown'
      // Type guard to safely access err.message
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error adding client:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
            Add New Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="text-sm text-zinc-400">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={clientData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm text-zinc-400">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={clientData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm text-zinc-400">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={clientData.email}
                onChange={handleInputChange}
                placeholder="client@example.com"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm text-zinc-400">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={clientData.phone}
                onChange={handleInputChange}
                placeholder="123-456-7890"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address.street" className="text-sm text-zinc-400">
                Street Address
              </label>
              <Input
                id="address.street"
                name="address.street"
                type="text"
                value={clientData.address.street}
                onChange={handleInputChange}
                placeholder="123 Main St"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address.city" className="text-sm text-zinc-400">
                City
              </label>
              <Input
                id="address.city"
                name="address.city"
                type="text"
                value={clientData.address.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address.postalCodeOrZip"
                className="text-sm text-zinc-400"
              >
                Postal Code / Zip
              </label>
              <Input
                id="address.postalCodeOrZip"
                name="address.postalCodeOrZip"
                type="text"
                value={clientData.address.postalCodeOrZip}
                onChange={handleInputChange}
                placeholder="12345"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className="text-sm text-zinc-400">
                Company (Optional)
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                value={clientData.company}
                onChange={handleInputChange}
                placeholder="Client Company"
                className="w-full mt-1 bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="text-sm text-zinc-400">
                Add Image URL (Optional)
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="imageUrl"
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-teal-500"
                />
                <Button
                  type="button"
                  onClick={handleImageAdd}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Add
                </Button>
              </div>
              {clientData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-zinc-400">Added Images:</p>
                  <ul className="space-y-1">
                    {clientData.images.map((img, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-zinc-400"
                      >
                        <span>{img}</span>
                        <Button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="text-red-500 hover:text-red-600 bg-transparent"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-2"
            >
              {loading ? "Adding..." : "Add Client"}
              {!loading && <Plus className="w-5 h-5" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClient;
