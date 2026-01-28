// Mentor Preferences Tab Component
// Manage mentor preferences and availability

'use client';

import { useState } from 'react';

export function MentorPreferencesTab() {
  const [preferences, setPreferences] = useState({
    maxStudents: 10,
    sessionDuration: 60,
    advanceBooking: 24,
    autoAcceptBookings: false,
    weekendAvailability: false,
    preferredMeetingType: 'video',
    specializations: ['Software Engineering', 'Career Guidance'],
    industries: ['Technology', 'Startups'],
    experienceLevels: ['Beginner', 'Intermediate']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const currentArray = preferences[field as keyof typeof preferences] as string[];
    if (checked) {
      setPreferences({
        ...preferences,
        [field]: [...currentArray, value]
      });
    } else {
      setPreferences({
        ...preferences,
        [field]: currentArray.filter(item => item !== value)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating preferences:', preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Students
          </label>
          <input
            type="number"
            name="maxStudents"
            value={preferences.maxStudents}
            onChange={handleChange}
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Session Duration (minutes)
          </label>
          <select
            name="sessionDuration"
            value={preferences.sessionDuration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Advance Booking Required (hours)
          </label>
          <select
            name="advanceBooking"
            value={preferences.advanceBooking}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={2}>2 hours</option>
            <option value={4}>4 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Meeting Type
          </label>
          <select
            name="preferredMeetingType"
            value={preferences.preferredMeetingType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="video">Video Call</option>
            <option value="audio">Audio Call</option>
            <option value="chat">Text Chat</option>
            <option value="in-person">In Person</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoAcceptBookings"
            checked={preferences.autoAcceptBookings}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Automatically accept booking requests
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="weekendAvailability"
            checked={preferences.weekendAvailability}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Available on weekends
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specializations
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['Software Engineering', 'Data Science', 'Product Management', 'Career Guidance', 'Interview Prep', 'System Design'].map((spec) => (
            <div key={spec} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.specializations.includes(spec)}
                onChange={(e) => handleArrayChange('specializations', spec, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">{spec}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Experience Levels
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <div key={level} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.experienceLevels.includes(level)}
                onChange={(e) => handleArrayChange('experienceLevels', level, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">{level}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </div>
    </form>
  );
}