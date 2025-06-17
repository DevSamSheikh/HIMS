import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Legend,
  AreaChart,
  ReferenceLine,
  
} from 'recharts'

const data = [
  { month: 'Jan', last: 1200, current: 1800 },
  { month: 'Feb', last: 2100, current: 2200 },
  { month: 'Mar', last: 1700, current: 2000 },
  { month: 'Apr', last: 1300, current: 2100 },
  { month: 'May', last: 1500, current: 2300 },
  { month: 'Jun', last: 1400, current: 2000 },
  { month: 'Jul', last: 1600, current: 2500 },
]

const lastMonthTotal = 3004
const thisMonthTotal = 4504

const CustomLegend = () => (
  <div className="flex justify-center items-center gap-8 mt-4 mb-2">
    <div className="flex items-center gap-2">
      <span>
        <svg width="24" height="10">
          <circle cx="5" cy="5" r="5" fill="#2196F3" />
          <rect x="10" y="4" width="12" height="2" fill="#2196F3" />
        </svg>
      </span>
      <span className="font-medium text-gray-700">Last Month</span>
    </div>
    <span className="text-gray-300">|</span>
    <div className="flex items-center gap-2">
      <span>
        <svg width="24" height="10">
          <circle cx="5" cy="5" r="5" fill="#1DE9B6" />
          <rect x="10" y="4" width="12" height="2" fill="#1DE9B6" />
        </svg>
      </span>
      <span className="font-medium text-gray-700">This Month</span>
    </div>
  </div>
)

const CustomerSatisfactionchart = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-[#F8F9FA] p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-center mb-2 font-poppins">Customer Satisfaction</h2>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2196F3" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#2196F3" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1DE9B6" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#1DE9B6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="last"
              stroke="#2196F3"
              strokeWidth={3}
              fill="url(#colorLast)"
              dot={{ r: 6, fill: "#2196F3", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#2196F3", stroke: "#fff", strokeWidth: 3 }}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#1DE9B6"
              strokeWidth={3}
              fill="url(#colorCurrent)"
              dot={{ r: 6, fill: "#1DE9B6", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#1DE9B6", stroke: "#fff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend />
      <div className="flex justify-center items-center gap-12 mt-1">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm">Last Month</span>
          <span className="text-lg font-bold font-roboto text-black">${lastMonthTotal.toLocaleString()}</span>
        </div>
        <div className="border-l border-gray-200 h-8 mx-2" />
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm">This Month</span>
          <span className="text-lg font-bold font-roboto text-black">${thisMonthTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default CustomerSatisfactionchart
