// BottomBar.tsx
import {
  LayoutDashboard,
  Building2,
  ChartBar,
  User,
} from "lucide-react";
import Link from "next/link";

type BottomNavLinkProps = {
  href: string;
  icon: React.ReactNode;
};

const BottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 text-zinc-100 p-4 flex justify-around md:hidden border-t border-zinc-800">
      <BottomNavLink href="/dashboard" icon={<LayoutDashboard />} />
      <BottomNavLink href="/create" icon={<Building2 />} />
      <BottomNavLink href="/analytics" icon={<ChartBar />} />
      <BottomNavLink href="/account" icon={<User />} />
    </div>
  );
};

export default BottomBar;

const BottomNavLink = ({ href, icon }: BottomNavLinkProps) => (
  <Link href={href} className="p-2 hover:bg-zinc-800 rounded-md">
    {icon}
  </Link>
);
