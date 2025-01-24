import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Profile } from '../../types';

interface JobApplicantModalProps {
  applicant: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobApplicantModal({ applicant, isOpen, onClose }: JobApplicantModalProps) {
  if (!applicant) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Applicant Profile
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-4">
                    {applicant.avatar_url ? (
                      <img
                        src={applicant.avatar_url}
                        alt={applicant.full_name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-16 w-16 text-gray-300" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {applicant.full_name}
                      </h3>
                      {applicant.location && (
                        <p className="text-sm text-gray-500">{applicant.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                      <p className="mt-1">{applicant.phone || 'No phone number provided'}</p>
                      <p className="mt-1">{applicant.email}</p>
                    </div>

                    {applicant.skills && applicant.skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {applicant.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {applicant.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">About</h4>
                        <p className="mt-1 text-sm text-gray-600">{applicant.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
