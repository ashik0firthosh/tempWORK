import { useState } from 'react';
import { format } from 'date-fns';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import type { Application } from '../../types';
import JobApplicantModal from './JobApplicantModal';

interface JobApplicationsListProps {
  applications: Application[];
}

export default function JobApplicationsList({ applications }: JobApplicationsListProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Applications ({applications.length})</h3>
      
      <div className="space-y-4">
        {applications.map((application) => (
          <div 
            key={application.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 cursor-pointer transition-colors"
            onClick={() => setSelectedApplication(application)}
          >
            <div className="flex items-center space-x-4">
              {application.profile_snapshot?.avatar_url ? (
                <img
                  src={application.profile_snapshot.avatar_url}
                  alt={application.profile_snapshot.full_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-12 w-12 text-gray-300" />
              )}
              
              <div className="flex-1">
                <h4 className="font-medium">{application.profile_snapshot?.full_name}</h4>
                <p className="text-sm text-gray-500">
                  Applied {format(new Date(application.created_at), 'PPp')}
                </p>
              </div>
              
              <span className={`
                px-2 py-1 text-xs rounded-full
                ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${application.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                ${application.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <JobApplicantModal
        applicant={selectedApplication?.profile_snapshot || null}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
}
