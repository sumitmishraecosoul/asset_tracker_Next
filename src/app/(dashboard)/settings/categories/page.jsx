"use client";

import { useState } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";

const CategoryManagement = () => {
  // State for form inputs
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPrefix, setNewCategoryPrefix] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryCode, setNewSubcategoryCode] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  // Sample data - this would come from props/API
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Computer Assets",
      prefix: "CA",
      subcategories: [
        { id: 1, name: "Laptop", code: "LAP", tagPrefix: "CA-LAP", assetCount: 145 },
        { id: 2, name: "Desktop", code: "DESK", tagPrefix: "CA-DESK", assetCount: 89 },
        { id: 3, name: "Server", code: "SRV", tagPrefix: "CA-SRV", assetCount: 12 }
      ],
      totalAssets: 246
    },
    {
      id: 2,
      name: "External Equipment",
      prefix: "EE",
      subcategories: [
        { id: 4, name: "Keyboard", code: "KBD", tagPrefix: "EE-KBD", assetCount: 203 },
        { id: 5, name: "Mouse", code: "MSE", tagPrefix: "EE-MSE", assetCount: 198 },
        { id: 6, name: "LCD Monitor", code: "LCD", tagPrefix: "EE-LCD", assetCount: 156 },
        { id: 7, name: "Charger", code: "CHG", tagPrefix: "EE-CHG", assetCount: 87 },
        { id: 8, name: "Bag", code: "BAG", tagPrefix: "EE-BAG", assetCount: 45 }
      ],
      totalAssets: 689
    },
    {
      id: 3,
      name: "Office Supplies",
      prefix: "LM",
      subcategories: [
        { id: 9, name: "Printer", code: "PRT", tagPrefix: "LM-PRT", assetCount: 23 },
        { id: 10, name: "Scanner", code: "SCN", tagPrefix: "LM-SCN", assetCount: 15 }
      ],
      totalAssets: 38
    }
  ]);

  // API Functions (these would be passed as props in real implementation)
  const handleAddCategory = () => {
    if (newCategoryName.trim() && newCategoryPrefix.trim()) {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName,
        prefix: newCategoryPrefix.toUpperCase(),
        subcategories: [],
        totalAssets: 0
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryPrefix("");
      setShowAddCategoryForm(false);
    }
  };

  const handleAddSubcategory = (categoryId) => {
    if (newSubcategoryName.trim() && newSubcategoryCode.trim()) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        const newSubcategory = {
          id: Date.now(),
          name: newSubcategoryName,
          code: newSubcategoryCode.toUpperCase(),
          tagPrefix: `${category.prefix}-${newSubcategoryCode.toUpperCase()}`,
          assetCount: 0
        };
        
        const updatedCategories = categories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
            : cat
        );
        setCategories(updatedCategories);
        setNewSubcategoryName("");
        setNewSubcategoryCode("");
        setExpandedCategory(null);
      }
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (confirm("Are you sure you want to delete this category? This will also delete all subcategories.")) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      const updatedCategories = categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
          : cat
      );
      setCategories(updatedCategories);
    }
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Category Management</h3>
          <p className="text-slate-600 mt-1">Manage asset categories, subcategories, and tag prefixes</p>
        </div>
        <button
          onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Add New Category Form */}
      {showAddCategoryForm && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Add New Category</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category Name (e.g., Furniture)
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prefix (e.g., FUR)
              </label>
              <input
                type="text"
                value={newCategoryPrefix}
                onChange={(e) => setNewCategoryPrefix(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter prefix"
                maxLength={3}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Category
            </button>
            <button
              onClick={() => {
                setShowAddCategoryForm(false);
                setNewCategoryName("");
                setNewCategoryPrefix("");
              }}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {category.prefix}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{category.name}</h4>
                    <p className="text-sm text-slate-600">
                      {category.subcategories.length} subcategories • {category.totalAssets} assets
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Add Subcategory"
                  >
                    <FiPlus className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add Subcategory Form */}
            {expandedCategory === category.id && (
              <div className="p-6 bg-yellow-50 border-b border-slate-200">
                <h5 className="text-md font-semibold text-slate-900 mb-4">Add Subcategory</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subcategory Name (e.g., Chair)
                    </label>
                    <input
                      type="text"
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter subcategory name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Code (e.g., CHR)
                    </label>
                    <input
                      type="text"
                      value={newSubcategoryCode}
                      onChange={(e) => setNewSubcategoryCode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter code"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddSubcategory(category.id)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add Subcategory
                  </button>
                  <button
                    onClick={() => {
                      setExpandedCategory(null);
                      setNewSubcategoryName("");
                      setNewSubcategoryCode("");
                    }}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Subcategories List */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-slate-400 rounded flex items-center justify-center text-white text-xs font-bold">
                        {subcategory.code}
                      </div>
                      <button
                        onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete Subcategory"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                    <h6 className="font-medium text-slate-900 mb-1">{subcategory.name}</h6>
                    <p className="text-sm text-slate-600 mb-2">{subcategory.tagPrefix}</p>
                    <p className="text-sm font-semibold text-slate-700">{subcategory.assetCount} assets</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
