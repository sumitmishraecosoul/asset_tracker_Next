"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiX, FiMapPin, FiHome } from "react-icons/fi";
import locationService from "../../../../../services/locationService";

const LocationsSitesManagement = () => {
  // State for form inputs
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteLocation, setNewSiteLocation] = useState("");
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);

  const [locations, setLocations] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await locationService.getAllLocations();
        const locationsData = response?.data?.data || response?.data || [];
        
        setLocations(locationsData);
        
        // Derive sites from locations (as mentioned in assets page)
        const siteOptions = [];
        const seen = new Set();
        locationsData.forEach(location => {
          if (location.name && !seen.has(location.name)) {
            seen.add(location.name);
            siteOptions.push({
              id: location.id,
              name: location.name,
              location: location.name,
              assetCount: 0, // This would need to be calculated from backend
              department: "General"
            });
          }
        });
        setSites(siteOptions);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // API Functions (these would be passed as props in real implementation)
  const handleAddLocation = () => {
    if (newLocationName.trim() && newLocationAddress.trim()) {
      const newLocation = {
        id: Date.now(),
        name: newLocationName,
        address: newLocationAddress,
        assetCount: 0,
        siteCount: 0
      };
      setLocations([...locations, newLocation]);
      setNewLocationName("");
      setNewLocationAddress("");
      setShowAddLocationForm(false);
    }
  };

  const handleAddSite = () => {
    if (newSiteName.trim() && newSiteLocation.trim()) {
      const newSite = {
        id: Date.now(),
        name: newSiteName,
        location: newSiteLocation,
        assetCount: 0,
        department: "General"
      };
      setSites([...sites, newSite]);
      setNewSiteName("");
      setNewSiteLocation("");
      setShowAddSiteForm(false);
    }
  };

  const handleDeleteLocation = (locationId) => {
    if (confirm("Are you sure you want to delete this location? This will also delete all associated sites.")) {
      setLocations(locations.filter(loc => loc.id !== locationId));
      setSites(sites.filter(site => site.location !== locations.find(loc => loc.id === locationId)?.name));
    }
  };

  const handleDeleteSite = (siteId) => {
    if (confirm("Are you sure you want to delete this site?")) {
      setSites(sites.filter(site => site.id !== siteId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading locations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Locations & Sites Management</h3>
          <p className="text-slate-600 mt-1">Manage office locations and sites for asset tracking</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddLocationForm(!showAddLocationForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Add Location
          </button>
          <button
            onClick={() => setShowAddSiteForm(!showAddSiteForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Add Site
          </button>
        </div>
      </div>

      {/* Add New Location Form */}
      {showAddLocationForm && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Add New Location</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location Name (e.g., Main Office)
              </label>
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={newLocationAddress}
                onChange={(e) => setNewLocationAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full address"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Location
            </button>
            <button
              onClick={() => {
                setShowAddLocationForm(false);
                setNewLocationName("");
                setNewLocationAddress("");
              }}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add New Site Form */}
      {showAddSiteForm && (
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Add New Site</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Site Name (e.g., Floor 4 - HR)
              </label>
              <input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <select
                value={newSiteLocation}
                onChange={(e) => setNewSiteLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddSite}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Add Site
            </button>
            <button
              onClick={() => {
                setShowAddSiteForm(false);
                setNewSiteName("");
                setNewSiteLocation("");
              }}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Locations and Sites Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locations Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <FiMapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Locations</h4>
                <p className="text-sm text-slate-600">{locations.length} locations</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 mb-1">{location.name}</h5>
                      <p className="text-sm text-slate-600 mb-2">{location.address}</p>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>{location.assetCount} assets</span>
                        <span>{location.siteCount} sites</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors ml-2"
                      title="Delete Location"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sites Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <FiHome className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Sites</h4>
                <p className="text-sm text-slate-600">{sites.length} sites</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {sites.map((site) => (
                <div key={site.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 mb-1">{site.name}</h5>
                      <p className="text-sm text-slate-600 mb-2">{site.location}</p>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>{site.assetCount} assets</span>
                        <span>{site.department} dept.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors ml-2"
                      title="Delete Site"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsSitesManagement;
