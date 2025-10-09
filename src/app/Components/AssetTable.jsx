"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiArrowLeft, FiArrowRight, FiEye, FiX } from "react-icons/fi";
import employeeService from "../../../services/employeeService";
import assetService from "../../../services/assetService";


const statusBadge = (status) => {
  const map = {
    Assigned: "bg-blue-50 text-blue-700 border-blue-200",
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Under Maintenance": "bg-orange-50 text-orange-700 border-orange-200",
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

const AssetTable = ({ assets = [] }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subCategoryFilter, setSubCategoryFilter] = useState("All");
  const [assetStates, setAssetStates] = useState({});
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [activeAssetId, setActiveAssetId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const categories = useMemo(() => {
    return Array.from(new Set((assets || []).map((r) => 
      typeof r.category === 'object' ? r.category?.name : r.category
    ).filter(Boolean)));
  }, [assets]);
  const subCategories = useMemo(() => {
    return Array.from(new Set((assets || []).map((r) => 
      typeof r.subCategory === 'object' ? r.subCategory?.name : r.subCategory
    ).filter(Boolean)));
  }, [assets]);

  const [employees, setEmployees] = useState([]); // [{id, name}]

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await employeeService.getAllEmployees();
        const list = res?.data?.data || res?.data || [];
        const items = Array.isArray(list)
          ? list
              .map(e => ({ id: e?.id, name: e?.name }))
              .filter(e => e.id != null && e.name)
          : [];
        if (mounted) setEmployees(items);
      } catch (e) {
        // silently ignore in UI; dropdown will be empty
        if (mounted) setEmployees([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Initialize assigned state from backend data so it survives refresh
  useEffect(() => {
    const initial = {};
    (assets || []).forEach((a) => {
      const key = a.id ?? a.assetId ?? a.assetTagId;
      if (key != null) {
        initial[key] = Boolean(a.checkOut) || String(a.status).toLowerCase() === 'assigned';
      }
    });
    setAssetStates(initial);
  }, [assets]);

  const filtered = useMemo(() => {
    return (assets || []).filter((r) => {
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
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
    const matchesSub = subCategoryFilter === "All" || r.subCategory === subCategoryFilter;

      return matchesQuery && matchesStatus && matchesCategory && matchesSub;
    });
  }, [assets, query, statusFilter, categoryFilter, subCategoryFilter]);

  const openAssignModal = (assetId) => {
    setActiveAssetId(assetId);
    setSelectedEmployee("");
    setIsAssignOpen(true);
  };

  const openCheckinModal = (assetId) => {
    setActiveAssetId(assetId);
    setIsCheckinOpen(true);
  };

  const closeModals = () => {
    setIsAssignOpen(false);
    setIsCheckinOpen(false);
    setActiveAssetId("");
    setSelectedEmployee("");
  };

  const handleAssign = async () => {
    if (!selectedEmployee || !activeAssetId) return;
    try {
      await assetService.checkOutAsset({ assetId: Number(activeAssetId), employeeId: Number(selectedEmployee), checkOut: true });
      setAssetStates(prev => ({
        ...prev,
        [activeAssetId]: true,
      }));
      closeModals();
    } catch (e) {
      // keep modal open so user can retry/select again
      // optionally, you can add toast here if available in this component tree
      console.error('Checkout failed', e?.response?.data || e);
    }
  };

  const handleCheckinConfirm = async (confirm) => {
    if (confirm && activeAssetId) {
      try {
        await assetService.checkOutAsset({ assetId: Number(activeAssetId), checkOut: false });
        setAssetStates(prev => ({
          ...prev,
          [activeAssetId]: false,
        }));
      } catch (e) {
        console.error('Check-in failed', e?.response?.data || e);
      }
    }
    closeModals();
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
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Broken">Broken</option>
          </select>
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category</option>
            {categories && categories.length > 0 ? categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            )) : null}
          </select>
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm sm:col-span-1"
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
          >
            <option value="All">Sub Category</option>
            {subCategories && subCategories.length > 0 ? subCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            )) : null}
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
              <HeaderCell className="text-right">Actions</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((r, idx) => (
              <tr key={r.id ?? r.assetTagId} className={`hover:bg-slate-50/60 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}>
                <td className="py-3 px-4">{statusBadge(r.status)}</td>
                <td className="py-3 px-4 text-blue-600 font-semibold whitespace-nowrap">{r.assetTagId}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.model}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                  {typeof r.category === 'object' ? r.category?.name : r.category}
                </td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                  {typeof r.subCategory === 'object' ? r.subCategory?.name : r.subCategory}
                </td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                  {typeof r.location === 'object' 
                    ? (r.location?.name || r.location?.location)
                    : r.location}
                </td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                  {typeof r.site === 'object' 
                    ? (r.site?.name || r.site?.site)
                    : r.site}
                </td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.assignedTo}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        // Prefer numeric DB id; fall back to numeric-looking strings only
                        const raw = r.id ?? r.assetId;
                        const numericId =
                          typeof raw === 'number'
                            ? raw
                            : (typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : null);
                        if (!numericId) return; // don't navigate if we cannot determine a numeric id
                        router.push(`/dashboard/assets/${numericId}`)
                      }}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label="View asset details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => (assetStates[r.id] ? openCheckinModal(r.id) : openAssignModal(r.id))}
                      className={`h-10 w-10 inline-flex items-center justify-center rounded-full transition-all duration-200 ${
                        assetStates[r.id]
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600'
                          : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600'
                      }`}
                      aria-label={assetStates[r.id] ? "Toggle to left" : "Toggle to right"}
                    >
                      {assetStates[r.id] ? (
                        <FiArrowRight className="h-5 w-5" />
                      ) : (
                        <FiArrowLeft className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Assign Modal */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Assign to</h3>
              <button onClick={closeModals} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"><FiX className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200">
              <button onClick={closeModals} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedEmployee}
                className={`px-4 py-2 rounded-lg ${selectedEmployee ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              >
                Assign Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-in Confirmation Modal */}
      {isCheckinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Check-in Asset</h3>
              <button onClick={closeModals} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"><FiX className="h-5 w-5" /></button>
            </div>
            <div className="p-5">
              <p className="text-slate-700">Are you sure you want to check-in this asset?</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200">
              <button onClick={() => handleCheckinConfirm(false)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">No</button>
              <button onClick={() => handleCheckinConfirm(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Yes, Check-in</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AssetTable;


