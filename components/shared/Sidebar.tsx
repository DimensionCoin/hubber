// Sidebar.tsx
import {
  LayoutDashboard,
  Building2,
  Settings,
  CreditCard,
  User,
} from "lucide-react";
import Link from "next/link";

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-50 h-full bg-zinc-900 text-zinc-100 p-5 border-r border-zinc-800 min-h-screen">
      <nav className="space-y-4">
        <NavLink
          href="/dashboard"
          icon={<LayoutDashboard />}
          label="Dashboard"
        />
        <NavLink
          href="/create"
          icon={<Building2 />}
          label="Create Company"
        />
        <NavLink
          href="/manage"
          icon={<Settings />}
          label="Manage Company"
        />
        <NavLink href="/account" icon={<User />} label="Account" />
        <NavLink href="/billing" icon={<CreditCard />} label="Billing" />
      </nav>
    </aside>
  );
};

export default Sidebar;

const NavLink = ({ href, icon, label }: NavLinkProps) => (
  <Link
    href={href}
    className="flex items-center space-x-3 p-2 hover:bg-zinc-800 rounded-md"
  >
    {icon}
    <span>{label}</span>
  </Link>
);
