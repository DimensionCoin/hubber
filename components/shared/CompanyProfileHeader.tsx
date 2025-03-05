"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Building,
  Mail,
  Phone,
  ExternalLink,
  Globe2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  totalRevenue: number;
  status: string;
  createdAt: string;
  companyUrl: string;
}

const CompanyProfileHeader = () => {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!id) return;

        const response = await fetch(`/api/public/company?companyId=${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");

        const data = await response.json();
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-white mt-10">
        Loading company details...
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center text-red-500 mt-10">Company not found</div>
    );
  }

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 py-6">
      <div className="flex flex-col gap-4">
        {/* Company Name and Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
              {company.name}
            </h1>
            <Badge
              className={`
                ${
                  company.status === "active"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-zinc-500 hover:bg-zinc-600"
                } 
                text-white
                text-xs
              `}
            >
              {company.status.toUpperCase()}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/company/${id}/edit`)}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-900 hover:text-white hover:bg-zinc-800"
            >
              Edit
            </Button>
            {company.companyUrl && (
              <Button
                onClick={() => window.open(company.companyUrl, "_blank")}
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Visit
              </Button>
            )}
          </div>
        </div>

        {/* Contact and Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-zinc-300">
          {/* Business Type */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{company.businessType?.toUpperCase() || "N/A"}</span>
          </div>

          {/* Location */}
          {company.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                {company.address.city}, {company.address.country}
              </span>
            </div>
          )}

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{company.phone || "N/A"}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="truncate">{company.email || "N/A"}</span>
          </div>
        </div>

        {/* URL with Share Button */}
        {company.companyUrl && (
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Globe2 className="w-4 h-4 text-teal-400 shrink-0" />
            <a
              href={company.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]"
            >
              {company.companyUrl}
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: `${company.name} Company Page`,
                      url: company.companyUrl,
                    })
                    .catch((err) => console.error("Share failed:", err));
                } else {
                  navigator.clipboard
                    .writeText(company.companyUrl)
                    .then(() => alert("URL copied to clipboard!"))
                    .catch((err) => console.error("Copy failed:", err));
                }
              }}
              className="text-teal-400 hover:text-teal-300 focus:outline-none shrink-0"
              aria-label="Share company URL"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileHeader;
