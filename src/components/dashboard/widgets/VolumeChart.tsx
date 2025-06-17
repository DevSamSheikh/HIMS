import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { name: 'Jan', volume: 400, services: 200 },
  { name: 'Feb', volume: 420, services: 210 },
  { name: 'Mar', volume: 500, services: 250 },
  { name: 'Apr', volume: 450, services: 200 },
  { name: 'May', volume: 390, services: 180 },
  { name: 'Jun', volume: 320, services: 160 },
  { name: 'Jul', volume: 350, services: 170 },
]

const volumeTotal = 1135
const servicesTotal = 635

const VolumeChart = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-[#F8F9FA] p-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center font-poppins mb-2">Volume vs Service Level</h2>
      <div style={{ width: '100%', height: 270 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="volume" stackId="a" name="Volume" fill="#2196F3" radius={[8, 8, 0, 0]} barSize={32} />
            <Bar dataKey="services" stackId="a" name="Services" fill="#1DE9B6"  radius={[8, 8, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Custom Legend and Summary */}
      <div className="flex justify-center items-center gap-8 mt-6 w-full">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3  bg-[#2196F3]" />
          <span className="text-gray-500 font-semibold mr-2">Volume</span>
          <span className="text-lg font-bold text-[#222]">{volumeTotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3  bg-[#1DE9B6]" />
          <span className="text-gray-500 font-semibold mr-2">Services</span>
          <span className="text-lg font-bold text-[#222]">{servicesTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default VolumeChart
