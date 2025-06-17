import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", loyal: 380, new: 620, unique: 110 },
  { month: "Feb", loyal: -150, new: 180, unique: 220 },
  { month: "Mar", loyal: 250, new: 380, unique: 510 },
  { month: "Apr", loyal: 110, new: 200, unique: 40 },
  { month: "May", loyal: 550, new: 510, unique: 400 },
  { month: "Jun", loyal: 290, new: 0, unique: 420 },
  { month: "Jul", loyal: 720, new: 650, unique: 250 },
  { month: "Aug", loyal: 210, new: 280, unique: 640 },
  { month: "Sept", loyal: 580, new: 400, unique: 100 },
  { month: "Oct", loyal: 280, new: 110, unique: 600 },
  { month: "Nov", loyal: 180, new: 450, unique: 20 },
  { month: "Dec", loyal: 120, new: 590, unique: 350 },
];

const lineConfigs = [
  {
    key: "loyal",
    name: "Loyal Customers",
    color: "#A020F0",
  },
  {
    key: "new",
    name: "New Customers",
    color: "#FF4C4C",
  },
  {
    key: "unique",
    name: "Unique Customers",
    color: "#3DD65B",
  },
];

const TopSellingLinechart = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  // Custom legend to handle hover
  const renderLegend = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        marginBottom: 12,
      }}
    >
      {lineConfigs.map((line) => (
        <span
          key={line.key}
          onMouseEnter={() => setHovered(line.key)}
          onMouseLeave={() => setHovered(null)}
          style={{
            color: line.color,
            fontWeight: hovered === line.key ? "bold" : "normal",
            opacity:
              hovered && hovered !== line.key ? 0.4 : 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="16" height="8">
            <rect
              width="16"
              height="4"
              fill={line.color}
              opacity={
                hovered && hovered !== line.key ? 0.4 : 1
              }
            />
          </svg>
          {line.name}
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          {renderLegend()}
          {lineConfigs.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={4}
              dot={
                line.key === "new"
                  ? { r: 6, stroke: "#fff", strokeWidth: 2 }
                  : false
              }
              activeDot={
                line.key === "new"
                  ? { r: 10, stroke: "#FF4C4C", strokeWidth: 4, fill: "#fff" }
                  : undefined
              }
              opacity={hovered && hovered !== line.key ? 0.2 : 1}
              style={{ transition: "opacity 0.2s" }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingLinechart;
