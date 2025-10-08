"use client";

import { useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { useToast } from "./ToastProvider";

const AddEmployeeForm = ({ isOpen, onClose, onSubmit }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    phoneNumber: ""
  });

  // Sample data - this would come from backend API
  const departments = [
    { id: 1, name: "IT Department" },
    { id: 2, name: "HR Department" },
    { id: 3, name: "Finance Department" },
    { id: 4, name: "Marketing Department" },
    { id: 5, name: "Sales Department" },
    { id: 6, name: "Operations Department" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields.", {
        title: "Validation Error"
      });
      return;
    }

    const loadingToastId = toast.loading("Creating employee...", {
      title: "Adding Employee"
    });

    try {
      // Send data to backend API
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Employee created successfully:', result);
        
        toast.dismiss(loadingToastId);
        toast.success("Employee created successfully!", {
          title: "Success"
        });
        
        onSubmit(formData); // Call parent callback
        onClose();
        // Reset form
        setFormData({
          name: "",
          email: "",
          department: "",
          phoneNumber: ""
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.dismiss(loadingToastId);
        toast.error(errorData.message || 'Failed to create employee. Please try again.', {
          title: "Error"
        });
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.dismiss(loadingToastId);
      toast.error('Network error. Please check your connection and try again.', {
        title: "Connection Error"
      });
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.department && formData.phoneNumber;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Add New Employee</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Employee Information
              </h3>
              <p className="text-slate-600">Provide the basic details for the new employee.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                  placeholder="Enter email address"
                />
              </div>

              {/* Department Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isFormValid()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
