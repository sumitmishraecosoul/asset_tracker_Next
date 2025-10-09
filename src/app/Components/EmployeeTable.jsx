"use client";

import { useMemo, useState, useEffect } from "react";
import { FiEdit2, FiEye, FiSearch, FiUser, FiX } from "react-icons/fi";


const departmentBadge = (department) => {
  const colorMap = {
    "IT Department": "bg-blue-50 text-blue-700 border-blue-200",
    "Finance": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Marketing": "bg-purple-50 text-purple-700 border-purple-200",
    "HR": "bg-orange-50 text-orange-700 border-orange-200",
    "Sales": "bg-rose-50 text-rose-700 border-rose-200",
    "Operations": "bg-slate-50 text-slate-700 border-slate-200",
  };
  const cls = colorMap[department] || "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {department}
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

const EmployeeTable = ({ employees: initialEmployees = [], onEmployeesChange }) => {
  const [query, setQuery] = useState("");
  // Department filter removed
  const [employees, setEmployees] = useState(initialEmployees);

  // Sync with prop changes
  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  const handleDeleteEmployee = (employeeId) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    if (onEmployeesChange) {
      onEmployeesChange(updatedEmployees);
    }
  };

  // Departments memo removed

  const filtered = useMemo(() => {
    return (employees || []).filter((emp) => {
      const matchesQuery =
        !query ||
        emp.name.toLowerCase().includes(query.toLowerCase());

      return matchesQuery;
    });
  }, [query, employees]);

  return (
    <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm">
      <div className="p-4 border-b border-slate-200/70 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees by name..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 shadow-sm"
          />
        </div>

        {/* Department filter removed */}
      </div>

      <div className="overflow-auto max-h-[540px]">
        <table className="min-w-[1000px] w-full text-sm">
          <thead>
            <tr className="shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Department</HeaderCell>
              <HeaderCell>Phone Number</HeaderCell>
              <HeaderCell className="text-right">Actions</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((emp, idx) => (
              <tr key={emp.id} className={`hover:bg-slate-50/60 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700 font-medium">#{emp.id}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-900 font-semibold whitespace-nowrap">{emp.name}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{emp.email}</td>
                <td className="py-3 px-4">{departmentBadge(emp.department)}</td>
                <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{emp.phoneNumber}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2 text-slate-500">
                    <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" aria-label="View">
                      <FiEye />
                    </button>
                    <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" aria-label="Edit">
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDeleteEmployee(emp.id)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group" 
                      aria-label="Delete"
                    >
                      <FiX className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
};

export default EmployeeTable;
