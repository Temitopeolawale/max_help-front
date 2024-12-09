'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from './Layout'

const dummyData = {
  totalUnits: 0,
  totalProducts: 0,
  totalSales: 0,
  inventoryLevels: 0,
  recentSales: [
    { date: 'Jan', amount:0  },
    { date: 'Feb', amount: 0 },
    { date: 'Mar', amount: 0},
    { date: 'Apr', amount: 0 },
    { date: 'May', amount: 0 },
    { date: 'Jun', amount: 0 },
  ],
  topProducts: [
    { name: 'Product A', sales: 0 },
    { name: 'Product B', sales: 0 },
    { name: 'Product C', sales: 0},
    
  ],
}

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Total Units" value={dummyData.totalUnits} color="bg-blue-500" />
          <DashboardCard title="Total Products" value={dummyData.totalProducts} color="bg-green-500" />
          <DashboardCard title="Total Sales" value={`$${dummyData.totalSales.toLocaleString()}`} color="bg-yellow-500" />
          <DashboardCard title="Inventory Levels" value={dummyData.inventoryLevels} color="bg-purple-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Recent Sales">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dummyData.recentSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Top Products">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dummyData.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </Layout>
  )
}

const DashboardCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className={`p-4 rounded-lg shadow-md ${color} text-white`}>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
)

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    {children}
  </div>
)

export default Dashboard
