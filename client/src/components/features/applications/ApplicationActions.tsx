// Application Actions component - Client Component
// Provides action menu for application management

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { applications } from '@/lib/api';

interface ApplicationActionsProps {
  applicationId: string;
}

export function ApplicationActions({ applicationId }: ApplicationActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await applications.delete(applicationId);
      
      if (response.success) {
        // Refresh the page to update the list
        router.refresh();
      } else {
        alert('Failed to delete application. Please try again.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('An error occurred while deleting the application.');
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      // TODO: Implement duplicate functionality
      // This would create a new application based on the current one
      alert('Duplicate functionality coming soon!');
      setIsOpen(false);
    } catch (error) {
      console.error('Duplicate failed:', error);
      alert('An error occurred while duplicating the application.');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : '⋯'}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href={`/student/applications/${applicationId}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-2">👁️</span>
            View Details
          </Link>
          
          <Link
            href={`/student/applications/${applicationId}/edit`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-2">✏️</span>
            Edit Application
          </Link>
          
          <button
            onClick={handleDuplicate}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="mr-2">📋</span>
            Duplicate
          </button>
          
          <hr className="my-1 border-gray-200" />
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <span className="mr-2">🗑️</span>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}