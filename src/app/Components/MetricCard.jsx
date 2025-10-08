import React from "react";

const colorStyles = {
  blue: {
    cardBg: "bg-blue-50",
    iconBg: "bg-blue-500",
    valueText: "text-blue-600",
  },
  green: {
    cardBg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    valueText: "text-emerald-600",
  },
  orange: {
    cardBg: "bg-orange-50",
    iconBg: "bg-orange-500",
    valueText: "text-orange-600",
  },
  red: {
    cardBg: "bg-rose-50",
    iconBg: "bg-rose-500",
    valueText: "text-rose-600",
  },
};

const MetricCard = ({ value, title, color = "blue", icon }) => {
  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={
        `rounded-2xl ${styles.cardBg} ring-1 ring-slate-200/70 p-6 flex flex-col items-center justify-center text-center shadow-sm transition-transform hover:translate-y-[1px]`
      }
    >
      <div className={`h-12 w-12 ${styles.iconBg} text-white rounded-full flex items-center justify-center shadow-md`}>
        {icon}
      </div>

      <div className={`mt-4 text-3xl font-bold tracking-tight ${styles.valueText}`}>
        {value}
      </div>

      <div className="mt-1 text-slate-500 text-sm">
        {title}
      </div>
    </div>
  );
}

export default MetricCard;


