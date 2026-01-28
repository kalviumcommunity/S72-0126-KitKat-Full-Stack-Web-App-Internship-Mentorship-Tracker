// Availability Management Component
// Set and manage mentor availability

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function AvailabilityManagement() {
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '14:00' },
    sunday: { enabled: false, start: '10:00', end: '14:00' }
  });

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const updateSchedule = (day: string, field: string, value: any) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Weekly Availability */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Weekly Availability</h2>
          <p className="text-gray-600">Set your recurring weekly schedule</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map((day) => {
              const schedule = weeklySchedule[day.key as keyof typeof weeklySchedule];
              return (
                <div key={day.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={(e) => updateSchedule(day.key, 'enabled', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-900 w-20">{day.label}</span>
                  </div>
                  
                  {schedule.enabled && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">From:</label>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => updateSchedule(day.key, 'start', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">To:</label>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => updateSchedule(day.key, 'end', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!schedule.enabled && (
                    <span className="text-gray-500 text-sm">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center space-x-3">
            <Button className="bg-green-600 hover:bg-green-700">
              Save Schedule
            </Button>
            <Button variant="outline">
              Copy from Last Week
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Preferences */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Session Preferences</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Session Duration
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buffer Time Between Sessions
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="0">No buffer</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Sessions Per Day
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="3">3 sessions</option>
                <option value="4">4 sessions</option>
                <option value="5">5 sessions</option>
                <option value="6">6 sessions</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Booking Window
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="1">1 week</option>
                <option value="2">2 weeks</option>
                <option value="4">1 month</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Off */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Time Off & Exceptions</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <Button className="bg-red-600 hover:bg-red-700">
                Block Time Off
              </Button>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Upcoming Time Off</h4>
              <div className="space-y-2 text-sm text-yellow-700">
                <div className="flex items-center justify-between">
                  <span>Feb 15-17, 2024: Conference Travel</span>
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mar 1, 2024: Personal Day</span>
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}