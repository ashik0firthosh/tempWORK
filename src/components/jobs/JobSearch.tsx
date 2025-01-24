import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface JobSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'moving', label: 'House Moving' },
  { value: 'catering', label: 'Catering' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'other', label: 'Other' }
];

export default function JobSearch({ onSearch, onCategoryChange }: JobSearchProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search jobs..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
