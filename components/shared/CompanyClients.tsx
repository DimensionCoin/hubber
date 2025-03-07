"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  Mail,
  Phone,
  Search,
  Building,
  MapPin,
  User,
  Trash2,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  imageUrl?: string;
  address: {
    street: string;
    city: string;
    postalCodeOrZip: string;
  };
}

const CompanyClients = () => {
  const { id: companyId } = useParams();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`/api/client?companyId=${companyId}`);
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        setClients(data.clients || []);
        setFilteredClients(data.clients || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchClients();
  }, [companyId]);

  // Filter clients based on search term and active tab
  useEffect(() => {
    let filtered = [...clients];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.firstName.toLowerCase().includes(term) ||
          client.lastName.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          (client.company && client.company.toLowerCase().includes(term))
      );
    }

    // Apply tab filter
    if (activeTab === "company") {
      filtered = filtered.filter(
        (client) => client.company && client.company.trim() !== ""
      );
    } else if (activeTab === "individual") {
      filtered = filtered.filter(
        (client) => !client.company || client.company.trim() === ""
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, activeTab, clients]);

  // Handle client update
  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    setUpdating(true);

    try {
      const response = await fetch("/api/client", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          clientId: selectedClient._id,
          updatedData: selectedClient,
        }),
      });

      if (!response.ok) throw new Error("Failed to update client");

      toast.success("Client updated successfully!");
      setClients(
        clients.map((client) =>
          client._id === selectedClient._id ? selectedClient : client
        )
      );
    } catch (error) {
      console.error("❌ Error updating client:", error);
      toast.error("Error updating client.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle client deletion
  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    setDeleting(true);
    try {
      const response = await fetch("/api/client", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, clientId: selectedClient._id }),
      });

      if (!response.ok) throw new Error("Failed to delete client");

      toast.success("Client deleted successfully!");
      setClients(clients.filter((client) => client._id !== selectedClient._id));
      setFilteredClients(
        filteredClients.filter((client) => client._id !== selectedClient._id)
      );
      setSelectedClient(null);
    } catch (error) {
      console.error("❌ Error deleting client:", error);
      toast.error("Error deleting client.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-2 bg-zinc-900 border-zinc-800 p-3 rounded-md">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search clients..."
            className="pl-9 bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-white"
          onClick={() => router.push(`/company/${companyId}/newclient`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-zinc-800 border border-zinc-700 p-0.5">
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-900">
            All Clients
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-zinc-900"
          >
            Companies
          </TabsTrigger>
          <TabsTrigger
            value="individual"
            className="data-[state=active]:bg-zinc-900"
          >
            Individuals
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="mt-6">
          {filteredClients.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <User className="h-16 w-16 text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No Clients Found
                </h3>
                <p className="text-zinc-400 max-w-md mb-6">
                  {searchTerm
                    ? "No clients match your search criteria. Try a different search term."
                    : "You don't have any clients yet. Add your first client to get started."}
                </p>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => router.push(`/company/${companyId}/newclient`)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Client
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <Card
                  key={client._id}
                  className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {client.imageUrl ? (
                              <AvatarImage
                                src={client.imageUrl}
                                alt={`${client.firstName} ${client.lastName}`}
                              />
                            ) : (
                              <AvatarFallback className="bg-violet-500 text-white">
                                {client.firstName.charAt(0)}
                                {client.lastName.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg text-white">
                              {client.firstName} {client.lastName}
                            </h3>
                            <p className="text-sm text-zinc-300">
                              {client.company || "Individual Client"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-teal-400" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-teal-400" />
                            <span>{client.phone}</span>
                          </div>
                          {client.address && client.address.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-teal-400" />
                              <span>
                                {client.address.city}
                                {client.address.postalCodeOrZip &&
                                  `, ${client.address.postalCodeOrZip}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
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
                          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-white">
                                {client.firstName} {client.lastName}
                              </DialogTitle>
                              <DialogDescription className="text-zinc-400">
                                Client details and information
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  {client.imageUrl ? (
                                    <AvatarImage
                                      src={client.imageUrl}
                                      alt={`${client.firstName} ${client.lastName}`}
                                    />
                                  ) : (
                                    <AvatarFallback className="bg-violet-500 text-white text-xl">
                                      {client.firstName.charAt(0)}
                                      {client.lastName.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-medium text-white">
                                    {client.firstName} {client.lastName}
                                  </h3>
                                  <p className="text-zinc-400">
                                    {client.company || "Individual Client"}
                                  </p>
                                </div>
                              </div>

                              <Separator className="bg-zinc-800" />

                              <div className="space-y-2">
                                <h4 className="font-medium text-white">
                                  Contact Information
                                </h4>
                                <p className="flex items-center gap-2 text-zinc-400">
                                  <Mail className="h-4 w-4 text-teal-400" />
                                  {client.email}
                                </p>
                                <p className="flex items-center gap-2 text-zinc-400">
                                  <Phone className="h-4 w-4 text-teal-400" />
                                  {client.phone}
                                </p>
                              </div>

                              {client.address && (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-white">
                                    Address
                                  </h4>
                                  <p className="text-zinc-400">
                                    {client.address.street &&
                                      `${client.address.street}, `}
                                    {client.address.city &&
                                      `${client.address.city}, `}
                                    {client.address.postalCodeOrZip}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-600 text-white"
                              onClick={() => setSelectedClient(client)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-white">
                                Edit Client
                              </DialogTitle>
                              <DialogDescription className="text-zinc-400">
                                Make changes to the client information
                              </DialogDescription>
                            </DialogHeader>

                            {selectedClient && (
                              <div className="space-y-6 py-4">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <User className="h-5 w-5 text-teal-400" />
                                    Personal Information
                                  </h3>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <label className="text-sm font-medium text-zinc-400">
                                        First Name
                                      </label>
                                      <Input
                                        value={selectedClient.firstName}
                                        onChange={(e) =>
                                          setSelectedClient({
                                            ...selectedClient,
                                            firstName: e.target.value,
                                          })
                                        }
                                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <label className="text-sm font-medium text-zinc-400">
                                        Last Name
                                      </label>
                                      <Input
                                        value={selectedClient.lastName}
                                        onChange={(e) =>
                                          setSelectedClient({
                                            ...selectedClient,
                                            lastName: e.target.value,
                                          })
                                        }
                                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                {/* Contact Information */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-teal-400" />
                                    Contact Information
                                  </h3>

                                  <div className="grid gap-4">
                                    <div className="grid gap-2">
                                      <label className="text-sm font-medium text-zinc-400">
                                        Email
                                      </label>
                                      <Input
                                        value={selectedClient.email}
                                        onChange={(e) =>
                                          setSelectedClient({
                                            ...selectedClient,
                                            email: e.target.value,
                                          })
                                        }
                                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <label className="text-sm font-medium text-zinc-400">
                                        Phone
                                      </label>
                                      <Input
                                        value={selectedClient.phone}
                                        onChange={(e) =>
                                          setSelectedClient({
                                            ...selectedClient,
                                            phone: e.target.value,
                                          })
                                        }
                                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                {/* Company Information */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <Building className="h-5 w-5 text-teal-400" />
                                    Company Information
                                  </h3>

                                  <div className="grid gap-2">
                                    <label className="text-sm font-medium text-zinc-400">
                                      Company Name
                                    </label>
                                    <Input
                                      value={selectedClient.company || ""}
                                      onChange={(e) =>
                                        setSelectedClient({
                                          ...selectedClient,
                                          company: e.target.value,
                                        })
                                      }
                                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                      placeholder="Company name (optional)"
                                    />
                                  </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                {/* Address Information */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-teal-400" />
                                    Address Information
                                  </h3>

                                  <div className="grid gap-4">
                                    <div className="grid gap-2">
                                      <label className="text-sm font-medium text-zinc-400">
                                        Street Address
                                      </label>
                                      <Input
                                        value={
                                          selectedClient.address?.street || ""
                                        }
                                        onChange={(e) =>
                                          setSelectedClient({
                                            ...selectedClient,
                                            address: {
                                              ...selectedClient.address,
                                              street: e.target.value,
                                            },
                                          })
                                        }
                                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <label className="text-sm font-medium text-zinc-400">
                                          City
                                        </label>
                                        <Input
                                          value={
                                            selectedClient.address?.city || ""
                                          }
                                          onChange={(e) =>
                                            setSelectedClient({
                                              ...selectedClient,
                                              address: {
                                                ...selectedClient.address,
                                                city: e.target.value,
                                              },
                                            })
                                          }
                                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <label className="text-sm font-medium text-zinc-400">
                                          Postal Code
                                        </label>
                                        <Input
                                          value={
                                            selectedClient.address
                                              ?.postalCodeOrZip || ""
                                          }
                                          onChange={(e) =>
                                            setSelectedClient({
                                              ...selectedClient,
                                              address: {
                                                ...selectedClient.address,
                                                postalCodeOrZip: e.target.value,
                                              },
                                            })
                                          }
                                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-teal-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
                              <Button
                                variant="destructive"
                                className="w-full sm:w-auto"
                                disabled={deleting}
                                onClick={handleDeleteClient}
                              >
                                {deleting ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-zinc-700 border-t-white"></div>
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Client
                                  </>
                                )}
                              </Button>
                              <Button
                                type="submit"
                                className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={updating}
                                onClick={handleUpdateClient}
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
                              onClick={() =>
                                router.push(
                                  `/company/${companyId}/client/${client._id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-zinc-400 focus:text-white focus:bg-zinc-800"
                              onClick={() => {
                                setSelectedClient(client);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Client</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-400 focus:bg-zinc-800"
                              onClick={() => {
                                setSelectedClient(client);
                                setTimeout(() => {
                                  handleDeleteClient();
                                }, 100);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Client</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

export default CompanyClients;
