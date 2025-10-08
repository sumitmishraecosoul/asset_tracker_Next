"use client";

import { useState } from "react";
import { FiPlus, FiUsers } from "react-icons/fi";
import EmployeeTable from "@/app/Components/EmployeeTable";
import AddEmployeeForm from "@/app/Components/AddEmployeeForm";

const EmployeeManagement = () => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleEmployeeSubmit = (employeeData) => {
    console.log("New employee added:", employeeData);
    // Here you would typically:
    // - Refresh the employee list
    // - Update the EmployeeTable state
    // - Show success notification
    // - Handle any errors
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Employee Management</h3>
          <p className="text-slate-600 mt-1">Manage employee accounts, roles, and permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Employee Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900">8</h4>
              <p className="text-sm text-slate-600">Total Employees</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900">6</h4>
              <p className="text-sm text-slate-600">Active Departments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900">2</h4>
              <p className="text-sm text-slate-600">IT Department</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Employee Directory</h4>
              <p className="text-sm text-slate-600">View and manage all employees</p>
            </div>
          </div>
        </div>
        
        <div className="p-0">
          <EmployeeTable />
        </div>
      </div>

      {/* Add Employee Form Modal */}
      <AddEmployeeForm
        isOpen={showAddUserForm}
        onClose={() => setShowAddUserForm(false)}
        onSubmit={handleEmployeeSubmit}
      />
    </div>
  );
};

export default EmployeeManagement;
