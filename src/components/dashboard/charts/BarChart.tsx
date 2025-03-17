import React from "react";

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  height?: number;
  showValues?: boolean;
  showLabels?: boolean;
  className?: string;
}

const BarChart = ({
  data,
  height = 200,
  showValues = true,
  showLabels = true,
  className = "",
}: BarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <div className="flex h-full items-end justify-between gap-2">
        {data.map((item, index) => {
          const defaultColors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-amber-500",
            "bg-red-500",
            "bg-indigo-500",
            "bg-pink-500",
            "bg-teal-500",
          ];
          const barColor =
            item.color || defaultColors[index % defaultColors.length];
          const barHeight = `${(item.value / maxValue) * 100}%`;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end flex-1"
            >
              {showValues && (
                <span className="text-xs font-medium mb-1">{item.value}</span>
              )}
              <div
                className={`w-full rounded-t-md ${barColor}`}
                style={{ height: barHeight, minHeight: "4px" }}
              ></div>
              {showLabels && (
                <span className="text-xs mt-2 text-center truncate w-full">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
