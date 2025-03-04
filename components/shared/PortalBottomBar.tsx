"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Home, User, DollarSign, Clock } from "lucide-react";

const PortalBottomBar = () => {
  const { id } = useParams(); // ✅ Get company ID from the URL

  if (!id) return null; // Prevent rendering if no ID is available

  const navItems = [
    {
      href: `/company/portal/${id}`,
      icon: <Home className="w-6 h-6" />,
      label: "Home",
    },
    {
      href: `/company/portal/${id}/account`,
      icon: <User className="w-6 h-6" />,
      label: "Account",
    },
    {
      href: `/company/portal/${id}/payroll`,
      icon: <DollarSign className="w-6 h-6" />,
      label: "Payroll",
    },
    {
      href: `/company/portal/${id}/clock`,
      icon: <Clock className="w-6 h-6" />,
      label: "Clock In/Out",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-3 flex justify-around">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex flex-col items-center text-zinc-400 hover:text-teal-400 transition"
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default PortalBottomBar;
