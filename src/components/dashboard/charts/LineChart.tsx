import React from "react";

interface LineChartProps {
  data: {
    label: string;
    value: number;
  }[];
  height?: number;
  lineColor?: string;
  fillColor?: string;
  showDots?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

const LineChart = ({
  data,
  height = 200,
  lineColor = "stroke-blue-500",
  fillColor = "fill-blue-500/20",
  showDots = true,
  showLabels = true,
  showValues = true,
  className = "",
}: LineChartProps) => {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = maxValue - minValue;
  const padding = range * 0.1; // Add 10% padding

  const chartHeight = height - 40; // Adjust for labels
  const chartWidth = 100; // Percentage width

  // Generate points for the SVG path
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const normalizedValue =
      (item.value - minValue + padding) / (range + padding * 2);
    const y = (1 - normalizedValue) * chartHeight;
    return { x, y, ...item };
  });

  // Create the SVG path
  const linePath = points
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  // Create the area fill path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <div className="relative h-full w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Area fill */}
          <path d={areaPath} className={fillColor} />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            className={`${lineColor} stroke-2`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {showDots &&
            points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="2"
                className={`${lineColor} fill-background stroke-2`}
              />
            ))}
        </svg>

        {/* X-axis labels */}
        {showLabels && (
          <div className="absolute bottom-0 left-0 w-full flex justify-between px-2">
            {data.map((item, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* Y-axis values */}
        {showValues && (
          <div className="absolute top-0 right-0 h-full flex flex-col justify-between py-2">
            <div className="text-xs text-muted-foreground">{maxValue}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round((maxValue + minValue) / 2)}
            </div>
            <div className="text-xs text-muted-foreground">{minValue}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChart;
