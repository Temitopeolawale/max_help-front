import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

interface Sale {
  id: number;
  unit: string;
  date: string;
  amount: number;
  unitsSold: number;
}

interface Unit {
  id: number;
  name: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [quantitySold, setquantitySold] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [unit]);

  const fetchSales = async () => {
    if (!unit) return; // Ensure a unit is selected
    try {
      const response = await api.get(`/sales/${unit}`);
      console.log(response.data)
      setSales(response.data);
    } catch (error) {
      setError('Error fetching sales data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await api.get('/unit/get');
      console.log(response.data)
      setUnits(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sales/', {
        unit,
        date,
        amount: parseFloat(amount),
        unitsSold: parseInt(quantitySold),
      });
      setUnit('');
      setDate('');
      setAmount('');
      setquantitySold('');
      fetchSales();
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  if (loading) {
    return <Layout>Loading sales data...</Layout>;
  }

  if (error) {
    return <Layout><div className="text-red-500">{error}</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Sales Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a unit</option>
              {Array.isArray(units) &&
                units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
            </select>
          </div>
          <Input
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            id="amount"
            label="Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            id="quantitySold"
            label="Quantity Sold"
            type="number"
            value={quantitySold}
            onChange={(e) => setquantitySold(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="mt-4">Record Sale</Button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity Sold
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">{sale.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${sale.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.unitsSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Sales;
