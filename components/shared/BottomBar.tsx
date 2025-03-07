// BottomBar.tsx
import {
  LayoutDashboard,
  ChartBar,
  User,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";


const BottomBar: FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-950/80 border-t border-zinc-800 px-3 py-1 flex justify-around md:hidden">
      <BottomNavLink href="/dashboard" icon={<LayoutDashboard />} />
      <BottomNavLink href="/messages" icon={<MessageCircle />} />
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
