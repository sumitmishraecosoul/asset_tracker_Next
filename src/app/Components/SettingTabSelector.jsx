"use client";

import { useState } from "react";
import { FiSettings } from "react-icons/fi";

const SettingTabSelector = ({ activeTab, onTabChange }) => {
  const tabs = [
    // { id: "categories", label: "Categories & Tags", icon: <FiTag className="h-4 w-4" /> },
    // { id: "locations", label: "Locations & Sites", icon: <FiMapPin className="h-4 w-4" /> },
    { id: "employees", label: "Employee Management", icon: <FiSettings className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-sm p-6">
      <div className="flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-3 transition-colors ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-600" : "text-slate-500"}`}>
              {tab.icon}
            </span>
            <span className="font-medium text-sm">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingTabSelector;
