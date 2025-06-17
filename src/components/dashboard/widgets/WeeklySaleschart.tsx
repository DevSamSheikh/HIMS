import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', online: 14000, offline: 12000 },
  { day: 'Tue', online: 18000, offline: 11000 },
  { day: 'Wed', online: 6000, offline: 22000 },
  { day: 'Thu', online: 16000, offline: 7000 },
  { day: 'Fri', online: 13000, offline: 12000 },
  { day: 'Sat', online: 17000, offline: 15000 },
  { day: 'Sun', online: 19000, offline: 11000 },
]

const WeeklySaleschart = () => {
  return (
    <div className="w-full border-0 rounded-xl shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center font-poppins">
          <ShoppingCart className="mr-2 h-5 w-5  "  />
          Weekly Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" />
              <Bar dataKey="online" className='font-poppins' name="Online Sales" fill="#2196F3" radius={[6, 6, 0, 0]} />
              <Bar dataKey="offline" className='font-poppins' name="Offline Sales" fill="#1DE9B6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </div>
  )
}

export default WeeklySaleschart
