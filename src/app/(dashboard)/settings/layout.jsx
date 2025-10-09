"use client";

import { usePathname, useRouter } from "next/navigation";
import SettingTabSelector from "@/app/Components/SettingTabSelector";

const SettingsLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on current path
  const getActiveTab = () => {
    // if (pathname.includes("/categories")) return "categories";
    // if (pathname.includes("/locations")) return "locations";
    // if (pathname.includes("/users")) return "users";
    if (pathname.includes("/employees")) return "employees";
    return "employees"; // default to employees only
  };

  const handleTabChange = (tabId) => {
    router.push(`/settings/${tabId}`);
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-black text-4xl font-bold mb-3">Settings</h2>
        <p className="text-black text-lg mb-6">Manage your application settings and preferences.</p>
      </div>
      
      <SettingTabSelector activeTab={getActiveTab()} onTabChange={handleTabChange} />
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
