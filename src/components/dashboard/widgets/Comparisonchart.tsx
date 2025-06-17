import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', reality: 7000, target: 9000 },
  { month: 'Feb', reality: 6500, target: 8500 },
  { month: 'Mar', reality: 6000, target: 11000 },
  { month: 'Apr', reality: 7500, target: 9500 },
  { month: 'May', reality: 9000, target: 13000 },
  { month: 'June', reality: 8800, target: 12800 },
  { month: 'July', reality: 8800, target: 12800 },
]

const realityTotal = 8823
const targetTotal = 12122

const Comparisonchart = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-[#F8F9FA] p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-center mb-2 font-poppins">Target vs Reality</h2>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="reality" name="Reality Sales" fill="#6EE7B7" radius={[8, 8, 0, 0]} barSize={28} />
            <Bar dataKey="target" name="Target Sales" fill="#FACC15" radius={[8, 8, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Custom Legend and Summary */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-6 w-full">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#ECFDF5]">
            {/* Bag Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="3" stroke="#34D399" strokeWidth="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <div className="font-semibold text-[#222] leading-tight font-poppins">Reality Sales</div>
            <div className="text-xs text-gray-400">Global</div>
          </div>
          <span className="ml-4 text-[#4AB58E] font-bold text-lg font-roboto">{realityTotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#FEF9C3]">
            {/* Target Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#FACC15" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" stroke="#FACC15" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="#FACC15" />
            </svg>
          </span>
          <div>
            <div className="font-semibold text-[#222] leading-tight font-poppins">Target Sales</div>
            <div className="text-xs text-gray-400">Commercial</div>
          </div>
          <span className="ml-4 text-[#FFCF00] font-bold text-lg font-roboto">{targetTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default Comparisonchart
