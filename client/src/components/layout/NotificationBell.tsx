// Notification Bell component - Client Component
// Shows notification count and dropdown

'use client';

import { useState, useRef, useEffect } from 'react';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(3); // TODO: Get from API
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {/* Sample notifications - TODO: Replace with real data */}
            <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-900">New feedback received</p>
              <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-900">Application status updated</p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50">
              <p className="text-sm text-gray-900">Mentor assigned</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>
          
          <div className="px-4 py-2 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-500">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}