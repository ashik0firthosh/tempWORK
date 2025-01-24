import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { Job } from '../types';
import JobCard from '../components/jobs/JobCard';
import JobSearch from '../components/jobs/JobSearch';
import { useAuth } from '../contexts/AuthContext';
import { jobs } from '../lib/api';

export default function Jobs() {
  const [jobList, setJobList] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, selectedCategory, jobList]);

  async function fetchJobs() {
    try {
      const data = await jobs.getAll();
      setJobList(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  const filterJobs = () => {
    let filtered = [...jobList];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast.error('Please log in to apply for jobs');
      return;
    }

    try {
      await jobs.apply(jobId);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        toast.error('You have already applied for this job');
      } else {
        toast.error('Error applying for job');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <span className="text-gray-500">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </span>
      </div>

      <JobSearch
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
}
