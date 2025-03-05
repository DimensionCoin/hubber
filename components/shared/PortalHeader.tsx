"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const PortalHeader = () => {
  const { id } = useParams(); // ✅ Get company ID from URL
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!id) return;
        const response = await fetch(`/api/public/company?companyId=${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");

        const data = await response.json();
        setCompanyName(data.name);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  return (
    <div className="w-full px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
      <Link href="/" className="text-teal-400 font-bold text-xl">
        {loading ? "Loading..." : companyName || "Company Not Found"}
      </Link>
    </div>
  );
};

export default PortalHeader;
