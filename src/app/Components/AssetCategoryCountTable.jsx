import React from "react";

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

const AssetCategoryCountTable = ({ title = "Asset Categories", categories }) => {
  const data =
    categories ?? [
      { label: "Computer Assets", count: 245, percent: 44.4, colorClass: "bg-blue-500" },
      { label: "External Equipment", count: 189, percent: 34.2, colorClass: "bg-emerald-500" },
      { label: "Office Supplies", count: 76, percent: 13.8, colorClass: "bg-violet-500" },
      { label: "Furniture", count: 42, percent: 7.6, colorClass: "bg-orange-500" },
    ];

  const total = data.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return (
    <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-5">
      <h3 className="text-slate-900 font-semibold">{title}</h3>

      <div className="mt-2">
        {data.map((item) => (
          <Row
            key={item.label}
            label={item.label}
            count={item.count}
            percent={item.percent}
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


