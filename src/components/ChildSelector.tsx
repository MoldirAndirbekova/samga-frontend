'use client';

import { useState } from 'react';
import { ChevronDown, User, UserPlus } from 'lucide-react';
import { useChild, Child } from '@/contexts/ChildContext';
import { useRouter } from 'next/navigation';

interface ChildSelectorProps {
  onSelectChild: (childId: string | null) => void;
  selectedChildId?: string | null;
}

export default function ChildSelector({ onSelectChild, selectedChildId: propSelectedChildId }: ChildSelectorProps) {
  const { children, selectedChildId: contextSelectedChildId, loading, error } = useChild();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  // Use prop selectedChildId if provided, otherwise use context value
  const selectedChildId = propSelectedChildId !== undefined ? propSelectedChildId : contextSelectedChildId;
  
  const selectedChild = selectedChildId 
    ? children.find((c) => c.id === selectedChildId) 
    : null;

  const handleSelectChild = (child: Child) => {
    if (!child) return; // Don't allow null child selection
    onSelectChild(child.id);
    setIsOpen(false);
  };

  const handleAddChild = () => {
    setIsOpen(false);
    router.push('/profile');
  };

  // Show a message when no children are available
  if (!loading && children.length === 0) {
    return (
      <div className="text-sm bg-red-100 text-red-700 p-2 rounded-md">
        Please add a child to play games
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm">Child:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-3 py-1 text-black"
        >
          {loading ? (
            'Loading...'
          ) : selectedChild ? (
            selectedChild.full_name
          ) : (
            'Select Child'
          )}
          <ChevronDown className="ml-1 w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 bg-white text-gray-800 rounded shadow-md w-48">
          {/* Children list */}
          {children.map((child) => (
            <div
              key={child.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center"
              onClick={() => handleSelectChild(child)}
            >
              <User className="mr-2 w-4 h-4" />
              <span className={selectedChild?.id === child.id ? 'font-bold' : ''}>
                {child.full_name}
              </span>
            </div>
          ))}
          
          {/* Add New Child option */}
          <div 
            className="border-t border-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center text-blue-600"
            onClick={handleAddChild}
          >
            <UserPlus className="mr-2 w-4 h-4" />
            <span>Add New Child</span>
          </div>
        </div>
      )}
    </div>
  );
} 