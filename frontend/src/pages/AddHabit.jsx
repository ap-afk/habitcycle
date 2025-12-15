import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AddHabit = () => {
    const navigate = useNavigate();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(
        'http://localhost:3000/api/users/habits/create',
        {
          method: 'POST',
          credentials: 'include', // 🍪 IMPORTANT
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, frequency }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess('Habit added successfully!');
      setName('');
      setFrequency('daily');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Add New Habit
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Drink Water"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Habit'}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mt-4 text-center">{success}</p>
        )}
      </div>
    </div>
  );
};

export default AddHabit;
