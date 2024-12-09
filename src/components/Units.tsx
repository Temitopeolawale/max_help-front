import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

interface Unit {
  _id: number;
  name: string;
  location: string;
}

const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchUnits();
  }, []);


  
  const fetchUnits = async () => {
    try {
      const response = await api.get('/unit/get');
      console.log('Fetched units:', response.data);

      //set the units and reurn it for rendering 
      setUnits(response.data.data);

      
      setLoading(false)
      console.log("uni: ", units)
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/unit/create', { name, location });
      setName('');
      setLocation('');
      fetchUnits();
    } catch (error) {
      console.error('Error creating unit:', error);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('Deleting unit with id:', id); 
    try {
      await api.delete(`/unit/delete/${id}`);
      fetchUnits();
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div>
          <h3>loading</h3>
        </div>
      ) : (<div>

        <h4>fetched</h4>
        <h4></h4>
      </div>)}
      <h1 className="text-3xl font-bold mb-6">Units Management</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="location"
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <Button type="submit" className="mt-4">Create Unit</Button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(units) && units.length > 0 ? (
              units.map((unit) => (
                <tr key={unit._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{unit.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{unit.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    
                    <Button variant="danger" onClick={() => handleDelete(unit._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Units;

