// Sidebar.tsx
import {
  LayoutDashboard,
  User,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";


type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const Sidebar: FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-50 bg-zinc-950/80 p-2 min-h-full">
      <nav className="space-y-4 mt-4">
        <NavLink
          href="/dashboard"
          icon={<LayoutDashboard />}
          label="Dashboard"
        />
        <NavLink href="/messages" icon={<MessageCircle />} label="Messages" />
        <NavLink href="/search" icon={<Search />} label="Search" />
        <NavLink href="/account" icon={<User />} label="Account" />
      </nav>
    </aside>
  );
};
export default Sidebar;

const NavLink: FC<NavLinkProps> = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center space-x-3 p-3 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition"
  >
    {icon}
    <span>{label}</span>
  </Link>
);
