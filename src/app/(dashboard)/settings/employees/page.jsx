"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiUsers } from "react-icons/fi";
import EmployeeTable from "@/app/Components/EmployeeTable";
import AddEmployeeForm from "@/app/Components/AddEmployeeForm";
import employeeService from "../../../../../services/employeeService";

const EmployeeManagement = () => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await employeeService.getAllEmployees();
        const employeesData = response?.data?.data || response?.data || [];
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleEmployeeSubmit = (employeeData) => {
    console.log("New employee added:", employeeData);
    // Refresh the employee list
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees();
        const employeesData = response?.data?.data || response?.data || [];
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  };

  const handleEmployeesChange = (updatedEmployees) => {
    setEmployees(updatedEmployees);
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

      {/* Statistics temporarily hidden */}

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
          <EmployeeTable employees={employees} onEmployeesChange={handleEmployeesChange} />
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
