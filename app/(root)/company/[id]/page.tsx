"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, MapPin, Calendar, Building } from "lucide-react";

interface Employee {
  name: string;
  position: string;
}

interface Company {
  _id: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  address: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
  employees: Employee[];
  totalRevenue: number;
  status: string;
  createdAt: string;
  companyUrl: string; // ✅ Include the company URL
}

const CompanyPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/public/company?companyId=${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");

        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="text-center text-red-500 mt-10">Company not found</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg text-white space-y-6">
      {/* Company Name & Status */}
      <Card className="bg-zinc-800 border border-zinc-700">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="text-2xl">{company.name}</CardTitle>
          <p className="text-sm text-zinc-400">
            <Building className="w-4 h-4 inline-block mr-2 text-teal-400" />
            {company.businessType.toUpperCase()}
          </p>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center text-zinc-400">
            <Calendar className="w-4 h-4 mr-2 text-teal-400" />
            <span>
              Active since {new Date(company.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                company.status === "active" ? "bg-teal-400" : "bg-red-400"
              } mr-2`}
            ></span>
            <span className="text-sm text-zinc-400">{company.status}</span>
          </div>
        </CardContent>
      </Card>

      {/* Company URL */}
      <Card className="bg-zinc-800 border border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg">Company Portal</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-zinc-400">
          <a
            href={company.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline break-all"
          >
            {company.companyUrl}
          </a>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="bg-zinc-800 border border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg">Company Address</CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-400">
          <MapPin className="w-5 h-5 inline-block mr-2 text-teal-400" />
          {`${company.address.street}, ${company.address.city}, ${company.address.stateOrProvince}, ${company.address.postalCodeOrZip}, ${company.address.country}`}
        </CardContent>
      </Card>

      {/* Revenue & Employees */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-zinc-800 border border-zinc-700">
          <CardHeader>
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-zinc-400">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <span className="text-xl font-bold">
              ${company.totalRevenue.toLocaleString()}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border border-zinc-700">
          <CardHeader>
            <CardTitle className="text-lg">Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-zinc-400">
            <Users className="w-5 h-5 text-teal-400" />
            <span className="text-xl font-bold">
              {company.employees.length}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyPage;
