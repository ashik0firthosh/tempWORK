import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import InputField from '../components/forms/InputField';
import { jobs } from '../lib/api';

const CATEGORIES = [
  { value: 'moving', label: 'House Moving' },
  { value: 'catering', label: 'Catering' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'other', label: 'Other' }
];

export default function CreateJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setLoading(true);
    try {
      await jobs.create({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        location: formData.get('location') as string,
        payment: parseFloat(formData.get('payment') as string),
        duration: parseInt(formData.get('duration') as string, 10),
        date: formData.get('date') as string,
        status: 'open',
        employer_id: user.id // Add employer_id here
      });
      
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error: any) {
      toast.error(error.message || 'Error creating job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-gray-600">Only employers can post jobs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <InputField
          label="Job Title"
          name="title"
          type="text"
          required
          placeholder="e.g., House Moving Help Needed"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe the job requirements and responsibilities..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Location"
          name="location"
          type="text"
          required
          placeholder="e.g., 123 Main St, City"
        />

        <InputField
          label="Payment (USD)"
          name="payment"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="e.g., 100"
        />

        <InputField
          label="Duration (hours)"
          name="duration"
          type="number"
          min="1"
          required
          placeholder="e.g., 4"
        />

        <InputField
          label="Date"
          name="date"
          type="datetime-local"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
