"use client";

import { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import AssetTable from "@/app/Components/AssetTable";
import AddAssetForm from "@/app/Components/AddAssetForm";
import categoryService from "../../../../../services/categoryService";
import subCategoryService from "../../../../../services/subCategoryService";
import locationService from "../../../../../services/locationService";
import assetService from "../../../../../services/assetService";

const AssetsPage = () => {
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sites, setSites] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Load each dataset independently so one failure doesn't block others
      try {
        const res = await categoryService.getAllCategories();
        if (isMounted) setCategories(res?.data?.data || res?.data || []);
      } catch (e) {
        console.error("Failed to load categories", e?.response?.status, e?.response?.data);
      }
      try {
        const res = await subCategoryService.getAllSubcategories();
        if (isMounted) setSubCategories(res?.data?.data || res?.data || []);
      } catch (e) {
        console.error("Failed to load subcategories", e?.response?.status, e?.response?.data);
      }
      try {
        const res = await locationService.getAllLocations();
        if (isMounted) setLocations(res?.data?.data || res?.data || []);
      } catch (e) {
        console.error("Failed to load locations", e?.response?.status, e?.response?.data);
      }
      try {
        const res = await assetService.getAllAssets();
        if (isMounted) setAssets(res?.data?.data || res?.data || []);
      } catch (e) {
        console.error("Failed to load assets", e?.response?.status, e?.response?.data);
      }
      // DO NOT USE getAllSites: derive from locations
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derive dropdown options from getAllLocations response
  const siteOptions = useMemo(() => {
    const seen = new Set();
    const options = [];
    for (let i = 0; i < locations.length; i++) {
      const site = locations[i]?.site;
      if (site && !seen.has(site)) {
        seen.add(site);
        options.push({ id: `site-${locations[i]?.id ?? i}`, name: site });
      }
    }
    return options;
  }, [locations]);

  const locationOptions = useMemo(() => {
    const seen = new Set();
    const options = [];
    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i]?.location;
      if (loc && !seen.has(loc)) {
        seen.add(loc);
        options.push({ id: `loc-${locations[i]?.id ?? i}`, name: loc });
      }
    }
    return options;
  }, [locations]);

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
      <AssetTable assets={assets} />

      {/* Add Asset Form Modal */}
      <AddAssetForm
        isOpen={showAddAssetForm}
        onClose={() => setShowAddAssetForm(false)}
        onSubmit={handleAddAsset}
        categories={categories}
        subCategories={subCategories}
        locations={locations}
        sites={siteOptions}
      />
    </div>
  );
}

export default AssetsPage;


