// UserDashLeads.tsx
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const sampleLeads = [
  {
    name: "Sarah Johnson",
    company: "Innovate Tech",
    email: "sarah@innovate.com",
    status: "Qualified",
    value: "$75,000",
  },
  {
    name: "David Chen",
    company: "Global Logistics",
    email: "dchen@globallogistics.com",
    status: "Proposal Sent",
    value: "$120,000",
  },
  {
    name: "Maria Rodriguez",
    company: "Sunshine Retail",
    email: "m.rodriguez@sunshineretail.com",
    status: "Contacted",
    value: "$45,000",
  },
  {
    name: "James Wilson",
    company: "Apex Financial",
    email: "jwilson@apexfinancial.com",
    status: "Negotiation",
    value: "$200,000",
  },
];

const UserDashLeads = () => {
  const [search, setSearch] = useState("");

  const filteredLeads = sampleLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Leads
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLeads.map((lead, index) => (
            <div
              key={index}
              className="flex justify-between p-2 rounded-lg hover:bg-zinc-800"
            >
              <div>
                <p className="text-white font-medium">{lead.name}</p>
                <p className="text-sm text-zinc-400">
                  {lead.company} - {lead.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-500 text-white">{lead.status}</Badge>
                <p className="text-sm font-medium text-white">{lead.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashLeads;
