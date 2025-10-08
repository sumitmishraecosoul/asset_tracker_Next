"use client";

import { useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";

const AddAssetForm = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 fields
    category: "",
    subCategory: "",
    site: "",
    location: "",
    status: "Available",
    
    // Step 2 fields for Computer Assets
    brand: "",
    model: "",
    serialNumber: "",
    description: "",
    processor: "",
    processorGeneration: "",
    totalRAM: "",
    ram1Size: "",
    ram2Size: "",
    warrantyStart: "",
    warrantyMonths: "",
    warrantyExpire: "",
    
    // Step 2 fields for External Equipment
    equipmentBrand: "",
    equipmentModel: "",
    equipmentSerialNumber: "",
    equipmentDescription: "",
    equipmentWarrantyStart: "",
    equipmentWarrantyEnd: ""
  });

  // Sample data - this would come from backend API
  const categories = [
    { id: 1, name: "Computer Assets" },
    { id: 2, name: "External Equipment" },
    { id: 3, name: "Office Supplies" }
  ];

  const subCategories = [
    { id: 1, name: "Laptop", categoryId: 1 },
    { id: 2, name: "Desktop", categoryId: 1 },
    { id: 3, name: "Server", categoryId: 1 },
    { id: 4, name: "Keyboard", categoryId: 2 },
    { id: 5, name: "Mouse", categoryId: 2 },
    { id: 6, name: "Charger", categoryId: 2 },
    { id: 7, name: "LCD Monitor", categoryId: 2 },
    { id: 8, name: "Printer", categoryId: 3 },
    { id: 9, name: "Scanner", categoryId: 3 }
  ];

  const sites = [
    { id: 1, name: "Floor 1 - Reception" },
    { id: 2, name: "Floor 2 - IT Department" },
    { id: 3, name: "Floor 3 - Finance" },
    { id: 4, name: "Floor 1 - Sales" },
    { id: 5, name: "Floor 2 - Marketing" }
  ];

  const locations = [
    { id: 1, name: "Head Office" },
    { id: 2, name: "Branch Office" },
    { id: 3, name: "Remote Office" }
  ];

  const statusOptions = [
    { value: "Available", label: "Available" },
    { value: "Under Maintenance", label: "Under Maintenance" },
    { value: "Broken", label: "Broken" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === 'category' && { subCategory: '' })
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Send data to backend API
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Asset created successfully:', result);
        onSubmit(formData); // Call parent callback
        onClose();
      } else {
        console.error('Failed to create asset');
        alert('Failed to create asset. Please try again.');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Error creating asset. Please try again.');
    }
  };

  const isFormValid = () => {
    return formData.category && formData.subCategory && formData.site && formData.location;
  };

  const isStep2Valid = () => {
    if (formData.category === "Computer Assets") {
      return formData.brand && formData.model && formData.serialNumber && formData.processor && formData.totalRAM;
    }
    if (formData.category === "External Equipment") {
      return formData.equipmentBrand && formData.equipmentModel && formData.equipmentSerialNumber;
    }
    return true; // For other categories, no additional validation needed
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Add New Asset</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                1
              </div>
              <span className={`text-sm mt-2 ${
                currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'
              }`}>
                Basic Information
              </span>
            </div>
            
            <div className="flex-1 h-0.5 bg-slate-200 relative">
              <div className={`h-full transition-all duration-300 ${
                currentStep >= 2 ? 'bg-blue-500' : 'bg-slate-200'
              }`} style={{ width: currentStep >= 2 ? '100%' : '0%' }} />
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
              <span className={`text-sm mt-2 ${
                currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'
              }`}>
                Detailed Specifications
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sub Category Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sub Category *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subCategory}
                      onChange={(e) => handleInputChange('subCategory', e.target.value)}
                      className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      disabled={!formData.category}
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories
                        .filter(sub => {
                          if (!formData.category) return false;
                          const selectedCategory = categories.find(cat => cat.name === formData.category);
                          return selectedCategory && sub.categoryId === selectedCategory.id;
                        })
                        .map((subCategory) => (
                          <option key={subCategory.id} value={subCategory.name}>
                            {subCategory.name}
                          </option>
                        ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Site Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Site *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.site}
                      onChange={(e) => handleInputChange('site', e.target.value)}
                      className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select Site</option>
                      {sites.map((site) => (
                        <option key={site.id} value={site.name}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {formData.category} Details
                </h3>
                <p className="text-slate-600">Provide specific details for the selected asset category.</p>
              </div>

              {formData.category === "Computer Assets" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Brand *
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. Dell, HP, Apple"
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Model *
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. Latitude 5520, EliteDesk 800"
                      />
                    </div>

                    {/* Serial Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Serial Number *
                      </label>
                      <input
                        type="text"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="Enter serial number"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="Additional details"
                      />
                    </div>

                    {/* Processor */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Processor
                      </label>
                      <input
                        type="text"
                        value={formData.processor}
                        onChange={(e) => handleInputChange('processor', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. Intel Core i7"
                      />
                    </div>

                    {/* Processor Generation */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Processor Generation
                      </label>
                      <input
                        type="text"
                        value={formData.processorGeneration}
                        onChange={(e) => handleInputChange('processorGeneration', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 11th Gen"
                      />
                    </div>

                    {/* Total RAM */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Total RAM
                      </label>
                      <input
                        type="text"
                        value={formData.totalRAM}
                        onChange={(e) => handleInputChange('totalRAM', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 16GB"
                      />
                    </div>

                    {/* RAM 1 Size */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        RAM 1 Size
                      </label>
                      <input
                        type="text"
                        value={formData.ram1Size}
                        onChange={(e) => handleInputChange('ram1Size', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 8GB"
                      />
                    </div>

                    {/* RAM 2 Size */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        RAM 2 Size
                      </label>
                      <input
                        type="text"
                        value={formData.ram2Size}
                        onChange={(e) => handleInputChange('ram2Size', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 8GB"
                      />
                    </div>

                    {/* Warranty Start */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty Start
                      </label>
                      <input
                        type="date"
                        value={formData.warrantyStart}
                        onChange={(e) => handleInputChange('warrantyStart', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                      />
                    </div>

                    {/* Warranty Months */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty Months
                      </label>
                      <input
                        type="number"
                        value={formData.warrantyMonths}
                        onChange={(e) => handleInputChange('warrantyMonths', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 12"
                      />
                    </div>

                    {/* Warranty Expire */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty Expire
                      </label>
                      <input
                        type="date"
                        value={formData.warrantyExpire}
                        onChange={(e) => handleInputChange('warrantyExpire', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.category === "External Equipment" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Brand *
                      </label>
                      <input
                        type="text"
                        value={formData.equipmentBrand}
                        onChange={(e) => handleInputChange('equipmentBrand', e.target.value)}
                        className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. Dell, HP, Apple"
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Model *
                      </label>
                      <input
                        type="text"
                        value={formData.equipmentModel}
                        onChange={(e) => handleInputChange('equipmentModel', e.target.value)}
                        className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. Latitude 5520, EliteDesk 800"
                      />
                    </div>

                    {/* Serial Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Serial Number *
                      </label>
                      <input
                        type="text"
                        value={formData.equipmentSerialNumber}
                        onChange={(e) => handleInputChange('equipmentSerialNumber', e.target.value)}
                        className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="Enter serial number"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.equipmentDescription}
                        onChange={(e) => handleInputChange('equipmentDescription', e.target.value)}
                        className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="Additional details"
                      />
                    </div>

                    {/* Warranty Start */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty Start
                      </label>
                      <input
                        type="date"
                        value={formData.equipmentWarrantyStart}
                        onChange={(e) => handleInputChange('equipmentWarrantyStart', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                      />
                    </div>

                    {/* Warranty End */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty End
                      </label>
                      <input
                        type="date"
                        value={formData.equipmentWarrantyEnd}
                        onChange={(e) => handleInputChange('equipmentWarrantyEnd', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.category !== "Computer Assets" && formData.category !== "External Equipment" && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Detailed Specifications</h3>
                  <p className="text-slate-600">No additional specifications required for this category.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <div>
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            {currentStep === 1 ? (
              <button
                onClick={handleNextStep}
                disabled={!isFormValid()}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isFormValid()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStep2Valid()}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isStep2Valid()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Add Asset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssetForm;
