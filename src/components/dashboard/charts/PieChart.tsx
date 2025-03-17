import React from "react";

interface PieChartProps {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  size?: number;
  showLegend?: boolean;
  className?: string;
}

const PieChart = ({
  data,
  size = 200,
  showLegend = true,
  className = "",
}: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const defaultColors = [
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#a855f7", // purple-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#6366f1", // indigo-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
  ];

  // Calculate the segments
  let startAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;

    // Calculate coordinates for the path
    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    const path = `
      M 50 50
      L ${startX} ${startY}
      A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;

    const color = item.color || defaultColors[index % defaultColors.length];

    const segment = {
      path,
      color,
      percentage,
      label: item.label,
      value: item.value,
    };

    startAngle = endAngle;
    return segment;
  });

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div style={{ width: `${size}px`, height: `${size}px` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
          {/* Optional: Add a circle in the middle for a donut chart */}
          {/* <circle cx="50" cy="50" r="25" fill="white" /> */}
        </svg>
      </div>

      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-sm"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="mr-2 truncate">{segment.label}</span>
              <span className="text-muted-foreground ml-auto">
                {Math.round(segment.percentage * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;
