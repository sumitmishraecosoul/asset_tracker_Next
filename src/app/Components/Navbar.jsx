"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiList, FiSettings } from "react-icons/fi";

const NavItem = ({ href, label, icon, isActive }) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      <span className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-500"}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};


const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <FiGrid className="h-4 w-4" /> },
    { href: "/dashboard/assets", label: "Asset List", icon: <FiList className="h-4 w-4" /> },
    { href: "/settings", label: "Settings", icon: <FiSettings className="h-4 w-4" /> },
  ];

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <img src="/thriveLogo.svg" alt="Thrive Logo" className="w-[5rem] h-[5rem]" />
            {/* <span className="text-2xl font-bold text-black">Asset Management</span> */}
          </div>

          <nav className="flex items-center gap-2">
            {links.map(({ href, label, icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={icon}
                isActive={pathname === href}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


