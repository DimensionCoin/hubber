// BottomBar.tsx
import {
  LayoutDashboard,
  Building2,
  ChartBar,
  User,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type BottomNavLinkProps = {
  href: string;
  icon: React.ReactNode;
};

const BottomBar: FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 p-4 flex justify-around md:hidden">
      <BottomNavLink href="/dashboard" icon={<LayoutDashboard />} />
      <BottomNavLink href="/create" icon={<Building2 />} />
      <BottomNavLink href="/analytics" icon={<ChartBar />} />
      <BottomNavLink href="/account" icon={<User />} />
    </div>
  );
};
export default BottomBar;

const BottomNavLink: FC<{ href: string; icon: React.ReactNode }> = ({
  href,
  icon,
}) => (
  <Link
    href={href}
    className="p-3 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition"
  >
    {icon}
  </Link>
);
