import React from 'react'

const products = [
  {
    name: "Home Decor Range",
    percent: 45,
    color: "#2196F3",
    bg: "#E3F2FD",
  },
  {
    name: "Disney Princess Pink Bag 18'",
    percent: 29,
    color: "#1DE9B6",
    bg: "#E0F7F4",
  },
  {
    name: "Bathroom Essentials",
    percent: 18,
    color: "#A020F0",
    bg: "#F3E8FF",
  },
  {
    name: "Apple Smartwatches",
    percent: 25,
    color: "#FFB300",
    bg: "#FFF8E1",
  },
]

const TopProductschart = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-[#F8F9FA] p-4">
      <h2 className="text-2xl font-semibold text-center mb-3 font-poppins">Top Products</h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-gray-400 text-base font-roboto font-medium border-b">
              <th className="py-2 px-4 text-left w-12">#</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left w-1/2">Popularity</th>
              <th className="py-2 px-4 text-left">Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.name} className="border-b last:border-b-0">
                <td className="py-2 px-2 font-roboto font-semibold text-gray-400">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-2 px-2 font-md font-roboto text-[#222]">{p.name}</td>
                <td className="py-2 px-2 ">
                  <div className="w-full max-w-[260px]">
                    <div className="h-2 rounded-full" style={{ background: p.bg }}>
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${p.percent}%`,
                          background: p.color,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className="inline-block px-4 py-1 rounded-lg font-poppins font-semibold text-base"
                    style={{
                      color: p.color,
                      background: p.bg,
                      border: `1.5px solid ${p.color}`,
                      minWidth: 56,
                      textAlign: 'center',
                    }}
                  >
                    {p.percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopProductschart
