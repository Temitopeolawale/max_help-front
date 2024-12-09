import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

interface Product {
  _id: number;
  name: string;
  price: number;
  description: string;
  quantityAvailable: number;
  inStock: boolean;
  unitName: string;
}

interface Unit {
  id: number;
  name: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [inStock, setInStock] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchUnits();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/product/get');
      console.log(response.data)
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await api.get('/unit/get');
      setUnits(response.data.data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/product/add', {
        name,
        price: parseFloat(price),
        description,
        quantityAvailable: parseInt(quantityAvailable),
        inStock,
        unitName: selectedUnit,
      });
      setName('');
      setPrice('');
      setDescription('');
      setQuantityAvailable('');
      setInStock(true);
      setSelectedUnit('');
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/product/delete/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    try {
      await api.put(`/product/set-quantity/${id}`, { quantity: newQuantity });
      fetchProducts();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Products Management</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="price"
          label="Price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <Input
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          id="quantityAvailable"
          label="Quantity Available"
          type="number"
          value={quantityAvailable}
          onChange={(e) => setQuantityAvailable(e.target.value)}
          required
        />
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="mr-2"
            />
            In Stock
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            id="unit"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select a unit</option>
            {Array.isArray(units) &&
              units.map((unit) => (
              <option key={unit.id} value={unit.name}>
              {unit.name}
          </option>
    ))}
          </select>
        </div>
        <Button type="submit" className="mt-4">Add Product</Button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                In Stock
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(products) && products.length > 0 ? (
  products.map((product) => (
    <tr key={product._id}>
      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Input
          type="number"
          value={product.quantityAvailable}
          onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value))}
          className="w-20"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {product.inStock ? 'Yes' : 'No'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{product.unitName}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button
          variant="danger"
          onClick={() => handleDelete(product._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={7} className="text-center py-4">
      No products available.
    </td>
  </tr>
)}

          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Products;

