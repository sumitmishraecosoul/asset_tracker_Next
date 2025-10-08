"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

// Mock dataset derived from the list table, enriched with details for demo purposes
const ASSETS = [
  {
    assetTagId: "CA-LAP-001",
    status: "Available",
    model: "Dell Latitude 5520",
    brand: "Dell",
    category: "Computer Assets",
    subCategory: "Laptop",
    location: "Floor 2",
    site: "Head Office",
    assignedTo: "Unassigned",
    department: "IT Department",
    processor: "Intel Core i7",
    processorGeneration: "11th Gen",
    totalRAM: "16GB",
    ramSlot1: "8GB",
    ramSlot2: "8GB",
    chargerSerial: "CH-DL-001",
    warrantyStart: "2023-01-15",
    warrantyMonths: 36,
    warrantyExpires: "2026-01-15",
    createdAt: "2023-01-15",
    updatedAt: "2024-01-10",
    activity: [
      { type: "success", title: "Asset created", when: "January 15, 2023", by: "Admin" },
      { type: "info", title: "Details updated", when: "January 10, 2024", by: "John Smith" },
    ],
  },
  {
    assetTagId: "CA-DESK-045",
    status: "Available",
    model: "HP EliteDesk 800",
    brand: "HP",
    category: "Computer Assets",
    subCategory: "Desktop",
    location: "Floor 1",
    site: "Head Office",
    assignedTo: "Unassigned",
    department: "HR",
    processor: "Intel Core i5",
    processorGeneration: "10th Gen",
    totalRAM: "16GB",
    ramSlot1: "8GB",
    ramSlot2: "8GB",
    chargerSerial: "CH-HP-045",
    warrantyStart: "2023-05-01",
    warrantyMonths: 24,
    warrantyExpires: "2025-05-01",
    createdAt: "2023-05-01",
    updatedAt: "2024-02-02",
    activity: [
      { type: "success", title: "Asset created", when: "May 1, 2023", by: "Admin" },
    ],
  },
  {
    assetTagId: "EE-KBD-023",
    status: "Assigned",
    model: "Logitech MX Keys",
    brand: "Logitech",
    category: "External Equipment",
    subCategory: "Keyboard",
    location: "Floor 3",
    site: "Branch Office",
    assignedTo: "Sarah Johnson",
    department: "Finance",
    processor: "-",
    processorGeneration: "-",
    totalRAM: "-",
    ramSlot1: "-",
    ramSlot2: "-",
    chargerSerial: "-",
    warrantyStart: "2023-03-20",
    warrantyMonths: 12,
    warrantyExpires: "2024-03-20",
    createdAt: "2023-03-20",
    updatedAt: "2023-10-10",
    activity: [
      { type: "success", title: "Asset created", when: "March 20, 2023", by: "Admin" },
      { type: "success", title: "Assigned to Sarah Johnson", when: "April 2, 2023", by: "Admin" },
    ],
  },
  {
    assetTagId: "EE-LCD-078",
    status: "Maintenance",
    model: "Dell UltraSharp U2720Q",
    brand: "Dell",
    category: "External Equipment",
    subCategory: "LCD Monitor",
    location: "Floor 2",
    site: "Head Office",
    assignedTo: "Unassigned",
    department: "IT Department",
    processor: "-",
    processorGeneration: "-",
    totalRAM: "-",
    ramSlot1: "-",
    ramSlot2: "-",
    chargerSerial: "-",
    warrantyStart: "2022-09-10",
    warrantyMonths: 36,
    warrantyExpires: "2025-09-10",
    createdAt: "2022-09-10",
    updatedAt: "2024-05-12",
    activity: [
      { type: "success", title: "Asset created", when: "September 10, 2022", by: "Admin" },
      { type: "warning", title: "Moved to maintenance", when: "May 12, 2024", by: "System" },
    ],
  },
  {
    assetTagId: "CA-LAP-089",
    status: "Assigned",
    model: "MacBook Pro 16\"",
    brand: "Apple",
    category: "Computer Assets",
    subCategory: "Laptop",
    location: "Floor 4",
    site: "Head Office",
    assignedTo: "Mike Wilson",
    department: "Marketing",
    processor: "Apple M1 Pro",
    processorGeneration: "-",
    totalRAM: "16GB",
    ramSlot1: "Unified",
    ramSlot2: "-",
    chargerSerial: "CH-AP-089",
    warrantyStart: "2023-07-01",
    warrantyMonths: 24,
    warrantyExpires: "2025-07-01",
    createdAt: "2023-07-01",
    updatedAt: "2024-03-04",
    activity: [
      { type: "success", title: "Asset created", when: "July 1, 2023", by: "Admin" },
      { type: "success", title: "Assigned to Mike Wilson", when: "July 4, 2023", by: "Admin" },
    ],
  },
];

const StatusBadge = ({ status }) => {
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

export default function AssetDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const asset = useMemo(() => {
    const id = decodeURIComponent((params?.id || "").toString());
    return ASSETS.find((a) => a.assetTagId === id) || null;
  }, [params]);

  if (!asset) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Asset Not Found</h2>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Go Back</button>
        </div>
        <p className="text-slate-600">No asset found for id provided in the URL.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Asset Details</h2>
            <StatusBadge status={asset.status} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.back()} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Close</button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Assign Asset</button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left summary card */}
          <div className="lg:col-span-1">
            <div className="border border-slate-200 rounded-xl p-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white grid place-items-center text-2xl font-semibold mb-4">
                {/* Simple placeholder icon */}
                💻
              </div>
              <div className="space-y-1">
                <div className="text-slate-900 font-semibold">{asset.assetTagId}</div>
                <div className="text-slate-500 text-sm">{asset.model}</div>
              </div>
            </div>
          </div>

          {/* Right specification grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Technical Specifications</h3>
              <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Processor:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.processor}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Generation:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.processorGeneration}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Total RAM:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.totalRAM}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">RAM Slot 1:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.ramSlot1}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">RAM Slot 2:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.ramSlot2}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Charger Serial:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.chargerSerial}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Basic Information</h3>
              <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Brand:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.brand}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Model:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.model}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Serial Number:</dt>
                  <dd className="text-slate-900 text-sm text-right">—</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Category:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.category}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Sub Category:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.subCategory}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Description:</dt>
                  <dd className="text-slate-900 text-sm text-right">High-performance business device</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Location & Assignment</h3>
              <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Site:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.site}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Location:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.location}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Department:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.department}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Assigned To:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.assignedTo}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Warranty Information</h3>
              <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Warranty Start:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.warrantyStart}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Warranty Period:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.warrantyMonths} months</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Warranty Expires:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.warrantyExpires}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Created:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.createdAt}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 p-3">
                  <dt className="text-slate-500 text-sm">Last Updated:</dt>
                  <dd className="text-slate-900 text-sm text-right">{asset.updatedAt}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Activity</h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            {asset.activity.map((a, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 ${idx !== asset.activity.length - 1 ? 'border-b border-slate-200' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${a.type === 'success' ? 'bg-emerald-500' : a.type === 'warning' ? 'bg-orange-500' : 'bg-slate-400'}`} />
                  <span className="text-sm text-slate-900">{a.title}</span>
                </div>
                <div className="text-xs text-slate-500">{a.when}{a.by ? ` by ${a.by}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


