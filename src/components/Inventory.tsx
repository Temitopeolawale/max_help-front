import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

interface InventoryItem {
  id: number;
  unit: string;
  product: string;
  stock: number;
  reorderPoint: number;
}

interface Unit {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [unit, setUnit] = useState('');
  const [product, setProduct] = useState('');
  const [stock, setStock] = useState('');
  const [reorderPoint, setReorderPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch units and products on mount
  useEffect(() => {
    fetchUnits();
    fetchProducts();
  }, []);

  // Fetch inventory whenever a unit is selected
  useEffect(() => {
    if (unit) {
      fetchInventory(unit);
    }
  }, [unit]);

  // Fetch inventory for a specific unit
  const fetchInventory = async (selectedUnit: string) => {
    setLoading(true);
    setError(null); // Clear previous errors
    console.log("Fetching inventory for unit:", selectedUnit); // Debug
    try {
      const response = await api.get<InventoryItem[]>(`/inventory/${selectedUnit}`);
      console.log("Inventory data:", response.data); // Debug
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error); // Debug
      setError('Error fetching inventory data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available units
  const fetchUnits = async () => {
    try {
      const response = await api.get('/unit/get');
      console.log("Units:", response.data.data); // Debug
      setUnits(response.data.data);
    } catch (error) {
      console.error('Error fetching units:', error);
      setError('Error fetching units. Please try again later.');
    }
  };

  // Fetch available products
  const fetchProducts = async () => {
    try {
      const response = await api.get('/product/get');
      console.log("Products:", response.data.data); // Debug
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products. Please try again later.');
    }
  };

  // Handle form submission for adding inventory
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Adding inventory:", { unit, product, stock, reorderPoint }); // Debug
      await api.post('/inventory/', {
        unit,
        product,
        stock: parseInt(stock),
        reorderPoint: parseInt(reorderPoint),
      });
      setProduct('');
      setStock('');
      setReorderPoint('');
      fetchInventory(unit);
    } catch (error) {
      console.error('Error adding inventory:', error);
      setError('Error adding inventory. Please try again later.');
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unit Selector */}
          <div>
            <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                console.log("Selected unit:", e.target.value); // Debug
              }}
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Selector */}
          <div>
            <label htmlFor="product" className="block mb-2 text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              id="product"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                console.log("Selected product:", e.target.value); // Debug
              }}
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Input */}
          <Input
            id="stock"
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          {/* Reorder Point Input */}
          <Input
            id="reorderPoint"
            label="Reorder Point"
            type="number"
            value={reorderPoint}
            onChange={(e) => setReorderPoint(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="mt-4">
          Add Inventory
        </Button>
      </form>

      {/* Inventory Table */}
      {loading ? (
        <div>Loading inventory data...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Point
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.reorderPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Inventory;
