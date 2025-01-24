import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => Promise<void>;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await onApply(job.id);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        toast.error('You have already applied for this job');
      } else {
        toast.error('Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-4">{job.description}</p>
      <div className="space-y-2 text-sm text-gray-500">
        <p>📍 {job.location}</p>
        <p>💰 {job.payment}</p>
        <p>⏱️ {job.duration} hours</p>
        <p>📅 {format(new Date(job.date), 'PPP')}</p>
      </div>
      <button 
        onClick={handleApply}
        disabled={loading}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Applying...' : 'Apply Now'}
      </button>
    </div>
  );
}
