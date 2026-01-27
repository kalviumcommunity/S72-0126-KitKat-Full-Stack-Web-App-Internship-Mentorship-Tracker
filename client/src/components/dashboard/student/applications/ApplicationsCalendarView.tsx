// Applications Calendar View Component
// Calendar view showing applications by apply date with interviews and deadlines

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ApplicationFilters } from '@/app/dashboard/user/applications/page';

interface CalendarEvent {
  id: string;
  type: 'application' | 'interview' | 'deadline';
  title: string;
  company: string;
  date: string;
  status?: string;
  time?: string;
  logo: string;
}

interface ApplicationsCalendarViewProps {
  filters: ApplicationFilters;
  onViewApplication: (id: string) => void;
}

export function ApplicationsCalendarView({
  filters,
  onViewApplication
}: ApplicationsCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: '1',
      type: 'application',
      title: 'Applied to Google',
      company: 'Google',
      date: '2024-01-15',
      status: 'Interview',
      logo: '🔍'
    },
    {
      id: '2',
      type: 'interview',
      title: 'Technical Interview',
      company: 'Google',
      date: '2024-01-30',
      time: '2:00 PM',
      logo: '🔍'
    },
    {
      id: '3',
      type: 'application',
      title: 'Applied to Microsoft',
      company: 'Microsoft',
      date: '2024-01-14',
      status: 'Screening',
      logo: '🪟'
    },
    {
      id: '4',
      type: 'deadline',
      title: 'Application Deadline',
      company: 'TechCorp',
      date: '2024-02-02',
      logo: '⏰'
    },
    {
      id: '5',
      type: 'application',
      title: 'Applied to Apple',
      company: 'Apple',
      date: '2024-01-13',
      status: 'Applied',
      logo: '🍎'
    }
  ];

  const getEventColor = (type: string, status?: string) => {
    if (type === 'interview') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (type === 'deadline') return 'bg-red-100 text-red-800 border-red-200';
    
    // Application events colored by status
    const statusColors = {
      'Applied': 'bg-blue-100 text-blue-800 border-blue-200',
      'Screening': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Interview': 'bg-purple-100 text-purple-800 border-purple-200',
      'Offer': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return status ? statusColors[status as keyof typeof statusColors] : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              →
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            onClick={() => setViewMode('month')}
            className="px-3 py-1"
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            onClick={() => setViewMode('week')}
            className="px-3 py-1"
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {getDaysInMonth(currentDate).map((date, index) => (
            <div
              key={index}
              className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              } ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              {date && (
                <>
                  {/* Date Number */}
                  <div className={`text-sm font-medium mb-2 ${
                    isToday(date) ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {getEventsForDate(date).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => event.type === 'application' && onViewApplication(event.id)}
                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${
                          getEventColor(event.type, event.status)
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">{event.logo}</span>
                          <span className="truncate font-medium">
                            {event.company}
                          </span>
                        </div>
                        <div className="truncate">
                          {event.title}
                        </div>
                        {event.time && (
                          <div className="text-xs opacity-75">
                            {event.time}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Legend:</span>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span className="text-sm text-gray-600">Applications</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
          <span className="text-sm text-gray-600">Interviews</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-sm text-gray-600">Deadlines</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-sm text-gray-600">Offers</span>
        </div>
      </div>

      {/* Upcoming Events Summary */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Upcoming This Week</h3>
        <div className="space-y-2">
          {events
            .filter(event => {
              const eventDate = new Date(event.date);
              const today = new Date();
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= today && eventDate <= weekFromNow;
            })
            .map(event => (
              <div key={event.id} className="flex items-center space-x-3 text-sm">
                <span>{event.logo}</span>
                <span className="font-medium">{event.company}</span>
                <span className="text-gray-600">{event.title}</span>
                <Badge className={getEventColor(event.type, event.status)} size="sm">
                  {new Date(event.date).toLocaleDateString()}
                </Badge>
                {event.time && (
                  <span className="text-gray-500">{event.time}</span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}