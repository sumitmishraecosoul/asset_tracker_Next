"use client";

import React, { useState, useEffect } from "react";
import { getAssetsCountByCategory } from "../../../services/assetService";

const Row = ({ label, count, percent, colorClass = "bg-slate-400" }) => {
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 ${colorClass} rounded-full`} />
        <span className="text-slate-700">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-slate-800 font-semibold">{count}</div>
        {typeof percent === "number" && (
          <div className="text-xs text-slate-400">{percent}%</div>
        )}
      </div>
    </div>
  );
};

const AssetCategoryCountTable = ({ title = "Asset Categories" }) => {
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await getAssetsCountByCategory();
        if (response.data && response.data.data) {
          setCategoryData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  // Define color classes for different categories
  const getColorClass = (categoryName) => {
    const colorMap = {
      "Computer Assets": "bg-blue-500",
      "External Equipments": "bg-emerald-500",
      "Office Supplies": "bg-violet-500",
      "Furniture": "bg-orange-500",
    };
    return colorMap[categoryName] || "bg-slate-400";
  };

  // Convert API data to component format
  const data = Object.entries(categoryData).map(([label, count]) => ({
    label,
    count,
    colorClass: getColorClass(label),
  }));

  const total = data.reduce((sum, item) => sum + Number(item.count || 0), 0);

  // Calculate percentages
  const dataWithPercentages = data.map((item) => ({
    ...item,
    percent: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0,
  }));

  if (loading) {
    return (
      <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-5">
        <h3 className="text-slate-900 font-semibold">{title}</h3>
        <div className="mt-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-5">
        <h3 className="text-slate-900 font-semibold">{title}</h3>
        <div className="mt-2 text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-5">
      <h3 className="text-slate-900 font-semibold">{title}</h3>

      <div className="mt-2">
        {dataWithPercentages.map((item) => (
          <Row
            key={item.label}
            label={item.label}
            count={item.count}
            percent={parseFloat(item.percent)}
            colorClass={item.colorClass}
          />
        ))}
      </div>

      <div className="my-2 h-px bg-slate-200" />

      <div className="flex items-center justify-between pt-1">
        <span className="text-slate-600">Total Assets</span>
        <span className="text-slate-900 font-semibold">{total}</span>
      </div>
    </section>
  );
}

export default AssetCategoryCountTable;


