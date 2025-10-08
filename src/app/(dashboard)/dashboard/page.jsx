import MetricCard from "@/app/Components/MetricCard";
import AssetCategoryCountTable from "@/app/Components/AssetCategoryCountTable";
import { FiCheck, FiCalendar, FiTool, FiX } from "react-icons/fi";

const DashboardPage = () => {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-black text-4xl font-bold mb-3">Dashboard</h2>
        <p className="text-black text-lg mb-6">Welcome back! Here's what's happening with your assets today.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard value={423} title="Assigned" color="blue" icon={<FiCheck className="h-5 w-5" />} />
          <MetricCard value={129} title="Available" color="green" icon={<FiCalendar className="h-5 w-5" />} />
          <MetricCard value={18} title="Maintenance" color="orange" icon={<FiTool className="h-5 w-5" />} />
          <MetricCard value={7} title="Broken" color="red" icon={<FiX className="h-5 w-5" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetCategoryCountTable />
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-6 flex items-center justify-center text-slate-400">
          Coming soon
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;


