"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import AssetTable from "@/app/Components/AssetTable";
import AddAssetForm from "@/app/Components/AddAssetForm";

const AssetsPage = () => {
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);

  const handleAddAsset = (assetData) => {
    console.log("New asset added:", assetData);
    // Here you would typically refresh the asset list or update the state
    // For now, we'll just log the data
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-2xl font-semibold">Asset Management</h1>
          <p className="text-slate-500">Track and manage all your company assets</p>
        </div>
        <button
          onClick={() => setShowAddAssetForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus className="h-4 w-4" />
          Add Asset
        </button>
      </div>

      {/* Asset Table */}
      <AssetTable />

      {/* Add Asset Form Modal */}
      <AddAssetForm
        isOpen={showAddAssetForm}
        onClose={() => setShowAddAssetForm(false)}
        onSubmit={handleAddAsset}
      />
    </div>
  );
}

export default AssetsPage;


