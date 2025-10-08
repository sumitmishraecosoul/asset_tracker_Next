"use client";

import { useMemo, useState } from "react";
import { FiSearch, FiArrowLeft, FiArrowRight, FiEye } from "react-icons/fi";

const sampleRows = [
  {
    status: "Assigned",
    assetTagId: "CA-LAP-001",
    model: "Dell Latitude 5520",
    category: "Computer Assets",
    subCategory: "Laptop",
    location: "Floor 2",
    site: "Head Office",
    assignedTo: "John Smith",
    department: "IT Department",
  },
  {
    status: "Available",
    assetTagId: "CA-DESK-045",
    model: "HP EliteDesk 800",
    category: "Computer Assets",
    subCategory: "Desktop",
    location: "Floor 1",
    site: "Head Office",
    assignedTo: "Unassigned",
    department: "HR",
  },
  {
    status: "Assigned",
    assetTagId: "EE-KBD-023",
    model: "Logitech MX Keys",
    category: "External Equipment",
    subCategory: "Keyboard",
    location: "Floor 3",
    site: "Branch Office",
    assignedTo: "Sarah Johnson",
    department: "Finance",
  },
  {
    status: "Maintenance",
    assetTagId: "EE-LCD-078",
    model: "Dell UltraSharp U2720Q",
    category: "External Equipment",
    subCategory: "LCD Monitor",
    location: "Floor 2",
    site: "Head Office",
    assignedTo: "Unassigned",
    department: "IT Department",
  },
  {
    status: "Assigned",
    assetTagId: "CA-LAP-089",
    model: "MacBook Pro 16\"",
    category: "Computer Assets",
    subCategory: "Laptop",
    location: "Floor 4",
    site: "Head Office",
    assignedTo: "Mike Wilson",
    department: "Marketing",
  },
];

const statusBadge = (status) => {
  const map = {
    Assigned: "bg-blue-50 text-blue-700 border-blue-200",
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Maintenance: "bg-orange-50 text-orange-700 border-orange-200",
    Broken: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls = map[status] || "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const HeaderCell = ({ children, className }) => (
  <th
    className={`sticky top-0 z-10 text-left text-[12px] h-[4rem] uppercase text-slate-500 bg-slate-50/80 border-y border-slate-200 py-3.5 px-4 ${className || ""}`}
  >
    {children}
  </th>
);

const AssetTable = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subCategoryFilter, setSubCategoryFilter] = useState("All");
  const [assetStates, setAssetStates] = useState({});

  const categories = useMemo(() => {
    return Array.from(new Set(sampleRows.map((r) => r.category)));
  }, []);
  const subCategories = useMemo(() => {
    return Array.from(new Set(sampleRows.map((r) => r.subCategory)));
  }, []);

  const filtered = useMemo(() => {
    return sampleRows.filter((r) => {
      const matchesQuery =
        !query ||
        [
          r.assetTagId,
          r.model,
          r.category,
          r.subCategory,
          r.location,
          r.site,
          r.assignedTo,
          r.department,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
    const matchesSub = subCategoryFilter === "All" || r.subCategory === subCategoryFilter;

      return matchesQuery && matchesStatus && matchesCategory && matchesSub;
    });
  }, [query, statusFilter, categoryFilter, subCategoryFilter]);

  const toggleAssetState = (assetTagId) => {
    setAssetStates(prev => ({
      ...prev,
      [assetTagId]: !prev[assetTagId]
    }));
  };

  return (
    <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm">
      <div className="p-4 border-b border-slate-200/70 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets by name, tag ID, model, or any other field..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Assigned">Assigned</option>
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Broken">Broken</option>
          </select>
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm sm:col-span-1"
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
          >
            <option value="All">Sub Category</option>
            {subCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto max-h-[540px]">
        <table className="min-w-[1200px] w-full text-sm">
          <thead>
            <tr className="shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Asset Tag ID</HeaderCell>
              <HeaderCell>Model</HeaderCell>
              <HeaderCell>Category</HeaderCell>
              <HeaderCell>Sub Category</HeaderCell>
              <HeaderCell>Location</HeaderCell>
              <HeaderCell>Site</HeaderCell>
              <HeaderCell>Assigned To</HeaderCell>
              <HeaderCell>Department</HeaderCell>
              <HeaderCell className="text-right">Actions</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((r, idx) => (
              <tr key={r.assetTagId} className={`hover:bg-slate-50/60 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}>
                <td className="py-3 px-4">{statusBadge(r.status)}</td>
                <td className="py-3 px-4 text-blue-600 font-semibold whitespace-nowrap">{r.assetTagId}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.model}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.category}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.subCategory}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.location}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.site}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.assignedTo}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.department}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label="View asset details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => toggleAssetState(r.assetTagId)}
                      className={`h-10 w-10 inline-flex items-center justify-center rounded-full transition-all duration-200 ${
                        assetStates[r.assetTagId] 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600' 
                          : 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600'
                      }`}
                      aria-label={assetStates[r.assetTagId] ? "Toggle to left" : "Toggle to right"}
                    >
                      {assetStates[r.assetTagId] ? (
                        <FiArrowLeft className="h-5 w-5" />
                      ) : (
                        <FiArrowRight className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AssetTable;


