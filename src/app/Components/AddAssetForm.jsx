"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { useToast } from "./ToastProvider";
import assetService from "../../../services/assetService";
import computerAssetService from "../../../services/computerAssetService";
import externalAssetService from "../../../services/externalAssetService";

const AddAssetForm = ({ isOpen, onClose, onSubmit, categories = [], subCategories = [], sites = [], locations = [] }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdAssetId, setCreatedAssetId] = useState(null);
  // Guard to avoid deleting successfully created assets on modal close/unmount
  const shouldCleanupRef = useRef(false);
  const toast = useToast();
  const normalizedCategory = (str) => (str || "").toString().trim().toLowerCase();
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
    totalRAM: "",
    ramSlot1: "",
    ramSlot2: "",
    warrantyStart: "",
    warrantyExpire: ""
  });
  // Dropdown options are now passed from parent via props

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (createdAssetId && shouldCleanupRef.current) {
        cleanupAsset();
      }
    };
  }, [createdAssetId]);

  const statusOptions = [
    { value: "Available", label: "Available" },
    { value: "Under Maintenance", label: "Under Maintenance" },
    { value: "Broken", label: "Broken" },
    { value: "Assigned", label: "Assigned" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === 'category' && { subCategory: '' })
    }));
  };

  const transformFormDataForAPI = () => {
    // Find category ID from category name
    const selectedCategory = categories.find(cat => cat.name === formData.category);
    const categoryId = selectedCategory ? selectedCategory.id : null;
    
    // Find subcategory ID from subcategory name
    const selectedSubCategory = subCategories.find(sub => sub.name === formData.subCategory);
    const subCategoryId = selectedSubCategory ? selectedSubCategory.id : null;
    
    // Map site and location to their backend IDs (locations array contains real ids)
    const selectedLocation = locations.find(l => l.location === formData.location);
    const locationId = selectedLocation ? selectedLocation.id : null;
    const siteName = formData.site;
    const siteId = locations.find(l => l.site === siteName)?.id ?? null;
    
    const apiData = {
      status: formData.status,
      categoryId,
      subCategoryId,
      siteId,
      locationId
    };
    
    console.log('Form data:', formData);
    console.log('Categories available:', categories);
    console.log('Subcategories available:', subCategories);
    console.log('Locations available:', locations);
    console.log('Transformed API data:', apiData);
    
    return apiData;
  };

  const handleNextStep = async () => {
    if (currentStep < 2) {
      const loadingToastId = toast.loading("Creating asset...", {
        title: "Adding Asset"
      });

      try {
        // Test API connectivity first
        console.log('Testing API connectivity...');
        try {
          const testResponse = await assetService.getAllAssets();
          console.log('API connectivity test successful:', testResponse);
        } catch (connectivityError) {
          console.error('API connectivity test failed:', connectivityError);
          throw new Error(`Cannot connect to backend API: ${connectivityError.message}`);
        }
        // Transform form data to match API requirements
        const apiData = transformFormDataForAPI();
        
        // Validate required fields
        if (!apiData.categoryId || !apiData.subCategoryId) {
          throw new Error('Please select both category and subcategory');
        }
        
        // Create base asset when moving to Step 2
        console.log('Creating base asset with data:', apiData);
        const response = await assetService.createAssets(apiData);
        console.log('Base asset creation response:', response);
        
        // Handle different possible response structures (following the pattern from assets page)
        let assetResult = response.data?.data || response.data;
        console.log('Asset result:', assetResult);
        
        if (!assetResult) {
          throw new Error('Asset creation failed - no response data');
        }
        
        // Check for different possible ID field names
        const assetId = assetResult.id || assetResult.assetId || assetResult.asset_id || assetResult.ID || assetResult.assetTagId;
        if (!assetId) {
          throw new Error('Asset creation failed - no ID returned');
        }
        
        setCreatedAssetId(assetId);
        // Mark for cleanup only after base asset exists
        shouldCleanupRef.current = true;
        
        toast.dismiss(loadingToastId);
        setCurrentStep(2);
      } catch (error) {
        console.error('Error creating base asset:', error);
        console.error('Error details:', {
          message: error.message,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          config: error?.config
        });
        toast.dismiss(loadingToastId);
        toast.error(error?.response?.data?.message || error.message || 'Failed to create asset. Please try again.', { 
          title: "Error" 
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!createdAssetId) {
      toast.error("Asset ID not found. Please try again.", {
        title: "Error"
      });
      return;
    }

    const loadingToastId = toast.loading("Completing asset creation...", {
      title: "Adding Asset"
    });

    try {
      // Create specific asset type based on category (base asset already exists)
      const category = normalizedCategory(formData.category);
      
      if (category.includes("computer")) {
        // Create computer asset
        const computerAssetData = {
          assetId: createdAssetId,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          description: formData.description,
          processor: formData.processor,
          totalRam: formData.totalRAM,
          ram1: formData.ramSlot1,
          ram2: formData.ramSlot2,
          warrantyStart: formData.warrantyStart,
          warrantyEnd: formData.warrantyExpire
        };

        console.log('Sending computer asset data:', computerAssetData);
        try {
          const { data: computerResult } = await computerAssetService.createComputerAsset(computerAssetData);
          console.log('Computer asset creation response:', computerResult);
        } catch (computerError) {
          console.error('Computer asset creation failed:', computerError);
          console.error('Computer asset error details:', {
            message: computerError.message,
            status: computerError?.response?.status,
            statusText: computerError?.response?.statusText,
            data: computerError?.response?.data,
            config: computerError?.config
          });
          throw computerError; // Re-throw to trigger the main error handling
        }

      } else if (category.includes("external")) {
        // Create external asset
        const externalAssetData = {
          assetId: createdAssetId,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          warrantyStart: formData.warrantyStart,
          warrantyEnd: formData.warrantyEnd
        };

        console.log('Sending external asset data:', externalAssetData);
        try {
          const { data: externalResult } = await externalAssetService.createExternalAsset(externalAssetData);
          console.log('External asset creation response:', externalResult);
        } catch (externalError) {
          console.error('External asset creation failed:', externalError);
          throw externalError; // Re-throw to trigger the main error handling
        }
      }

      // Verify base asset exists before declaring success
      try {
        const verifyRes = await assetService.getAssetsById(createdAssetId);
        const verifyData = verifyRes?.data?.data || verifyRes?.data;
        if (!verifyData) {
          throw new Error("Asset verification failed - not found after creation");
        }
      } catch (vErr) {
        throw vErr;
      }

      // Success - dismiss loading and show success message
      toast.dismiss(loadingToastId);
      toast.success("Asset created successfully!", {
        title: "Success"
      });
      
      onSubmit(formData); // Call parent callback
      // Prevent unmount cleanup; asset creation succeeded
      shouldCleanupRef.current = false;
      setCreatedAssetId(null); // Reset asset ID
      onClose();

    } catch (error) {
      console.error('Error in asset creation process:', error);
      console.error('Main error details:', {
        message: error.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        config: error?.config
      });
      
      // If we failed to create specific asset type, try to delete the base asset
      if (createdAssetId) {
        try {
          await assetService.deleteAssets(createdAssetId);
        } catch (deleteError) {
          console.error('Failed to delete base asset during compensation:', deleteError);
        }
      }

      toast.dismiss(loadingToastId);
      toast.error(error?.response?.data?.message || 'Failed to create asset. Please try again.', { 
        title: "Error" 
      });
    }
  };

  const cleanupAsset = async () => {
    if (createdAssetId) {
      try {
        await assetService.deleteAssets(createdAssetId);
      } catch (error) {
        console.error('Failed to cleanup asset:', error);
      }
    }
  };

  const handleCancel = async () => {
    await cleanupAsset();
    setCreatedAssetId(null);
    setCurrentStep(1);
    setFormData({
      category: "",
      subCategory: "",
      site: "",
      location: "",
      status: "Available",
      brand: "",
      model: "",
      serialNumber: "",
      description: "",
      processor: "",
      totalRAM: "",
      ramSlot1: "",
      ramSlot2: "",
      warrantyStart: "",
      warrantyExpire: ""
    });
    onClose();
  };

  const isFormValid = () => {
    return formData.category && formData.subCategory && formData.site && formData.location;
  };

  const isStep2Valid = () => {
    if (normalizedCategory(formData.category).includes("computer")) {
      return formData.brand && 
             formData.model && 
             formData.serialNumber && 
             formData.processor && 
             formData.ramSlot1 && 
             formData.ramSlot2 && 
             formData.totalRAM && 
             formData.warrantyStart && 
             formData.warrantyExpire;
    }
    if (normalizedCategory(formData.category).includes("external")) {
      return formData.brand && formData.model && formData.serialNumber;
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
            onClick={handleCancel}
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
                      {categories && categories.length > 0 ? categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      )) : null}
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
                      {subCategories && subCategories.length > 0 ? subCategories
                        .filter(sub => {
                          if (!formData.category || !categories) return false;
                          const selectedCategory = categories.find(cat => cat.name === formData.category);
                          return selectedCategory && sub.categoryId === selectedCategory.id;
                        })
                        .map((subCategory) => (
                          <option key={subCategory.id} value={subCategory.name}>
                            {subCategory.name}
                          </option>
                        )) : null}
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
                      {locations && locations.length > 0 ? Array.from(new Set(locations.map(l => l.site))).map((site) => (
                        <option key={site} value={site}>{site}</option>
                      )) : null}
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
                      {locations && locations.length > 0 ? locations
                        .filter(l => !formData.site || l.site === formData.site)
                        .map((l) => (
                          <option key={l.id} value={l.location}>{l.location}</option>
                        )) : null}
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

              {normalizedCategory(formData.category).includes("computer") && (
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

                    {/* Processor */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Processor *
                      </label>
                      <input
                        type="text"
                        value={formData.processor}
                        onChange={(e) => handleInputChange('processor', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. Intel Core i7"
                      />
                    </div>

                    {/* RAM Slot 1 */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        RAM1 *
                      </label>
                      <input
                        type="text"
                        value={formData.ramSlot1}
                        onChange={(e) => handleInputChange('ramSlot1', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 8GB"
                      />
                    </div>

                    {/* RAM Slot 2 */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        RAM2 *
                      </label>
                      <input
                        type="text"
                        value={formData.ramSlot2}
                        onChange={(e) => handleInputChange('ramSlot2', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 8GB"
                      />
                    </div>

                    {/* Total RAM */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Total RAM *
                      </label>
                      <input
                        type="text"
                        value={formData.totalRAM}
                        onChange={(e) => handleInputChange('totalRAM', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                        placeholder="e.g. 16GB"
                      />
                    </div>
                    

                    {/* Warranty Start */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty Start *
                      </label>
                      <input
                        type="date"
                        value={formData.warrantyStart}
                        onChange={(e) => handleInputChange('warrantyStart', e.target.value)}
                        className="w-full px-3 py-3 text-gray-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-700"
                      />
                    </div>


                    {/* Warranty Expire */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty End *
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

              {normalizedCategory(formData.category).includes("external") && (
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

                    {/* Warranty End */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Warranty End
                      </label>
                      <input
                        type="date"
                        value={formData.warrantyEnd}
                        onChange={(e) => handleInputChange('warrantyEnd', e.target.value)}
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
              onClick={handleCancel}
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
