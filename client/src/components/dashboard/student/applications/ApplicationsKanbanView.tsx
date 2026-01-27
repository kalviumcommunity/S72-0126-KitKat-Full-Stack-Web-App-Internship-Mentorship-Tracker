// Applications Kanban View Component
// Drag and drop kanban board for application status management

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ApplicationFilters } from '@/app/dashboard/user/applications/page';

interface Application {
  id: string;
  company: string;
  position: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;
  stipend: string;
  logo: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ApplicationsKanbanViewProps {
  filters: ApplicationFilters;
  onViewApplication: (id: string) => void;
  onEditApplication: (id: string) => void;
}

export function ApplicationsKanbanView({
  filters,
  onViewApplication,
  onEditApplication
}: ApplicationsKanbanViewProps) {
  // Mock data organized by status
  const [applicationsByStatus, setApplicationsByStatus] = useState<Record<string, Application[]>>({
    'Applied': [
      {
        id: '1',
        company: 'Apple',
        position: 'iOS Developer Intern',
        status: 'Applied',
        appliedDate: '2024-01-13',
        stipend: '$9,000/month',
        logo: '🍎',
        priority: 'high'
      },
      {
        id: '2',
        company: 'Tesla',
        position: 'ML Engineer Intern',
        status: 'Applied',
        appliedDate: '2024-01-12',
        stipend: '$8,200/month',
        logo: '⚡',
        priority: 'medium'
      }
    ],
    'Screening': [
      {
        id: '3',
        company: 'Microsoft',
        position: 'Product Manager Intern',
        status: 'Screening',
        appliedDate: '2024-01-14',
        stipend: '$7,500/month',
        logo: '🪟',
        priority: 'high'
      },
      {
        id: '4',
        company: 'Amazon',
        position: 'SDE Intern',
        status: 'Screening',
        appliedDate: '2024-01-10',
        stipend: '$7,800/month',
        logo: '📦'
      }
    ],
    'Interview': [
      {
        id: '5',
        company: 'Google',
        position: 'Software Engineer Intern',
        status: 'Interview',
        appliedDate: '2024-01-15',
        stipend: '$8,000/month',
        logo: '🔍',
        priority: 'high'
      }
    ],
    'Offer': [
      {
        id: '6',
        company: 'Meta',
        position: 'Frontend Engineer Intern',
        status: 'Offer',
        appliedDate: '2024-01-12',
        stipend: '$8,500/month',
        logo: '📘',
        priority: 'high'
      }
    ],
    'Rejected': [
      {
        id: '7',
        company: 'Netflix',
        position: 'Data Science Intern',
        status: 'Rejected',
        appliedDate: '2024-01-11',
        stipend: '$7,000/month',
        logo: '🎬'
      }
    ]
  });

  const [draggedItem, setDraggedItem] = useState<Application | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const statusColumns = [
    { id: 'Applied', title: 'Applied', color: 'bg-blue-100 text-blue-800', count: applicationsByStatus['Applied']?.length || 0 },
    { id: 'Screening', title: 'Screening', color: 'bg-yellow-100 text-yellow-800', count: applicationsByStatus['Screening']?.length || 0 },
    { id: 'Interview', title: 'Interview', color: 'bg-purple-100 text-purple-800', count: applicationsByStatus['Interview']?.length || 0 },
    { id: 'Offer', title: 'Offer', color: 'bg-green-100 text-green-800', count: applicationsByStatus['Offer']?.length || 0 },
    { id: 'Rejected', title: 'Rejected', color: 'bg-red-100 text-red-800', count: applicationsByStatus['Rejected']?.length || 0 }
  ];

  const getPriorityColor = (priority?: string) => {
    const colors = {
      'high': 'border-l-4 border-red-400',
      'medium': 'border-l-4 border-yellow-400',
      'low': 'border-l-4 border-green-400'
    };
    return priority ? colors[priority as keyof typeof colors] : '';
  };

  const handleDragStart = (e: React.DragEvent, application: Application) => {
    setDraggedItem(application);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(status);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.status === newStatus) {
      setDraggedItem(null);
      setDraggedOver(null);
      return;
    }

    // Update application status
    const updatedApplicationsByStatus = { ...applicationsByStatus };
    
    // Remove from old status
    updatedApplicationsByStatus[draggedItem.status] = updatedApplicationsByStatus[draggedItem.status].filter(
      app => app.id !== draggedItem.id
    );
    
    // Add to new status
    const updatedApplication = { ...draggedItem, status: newStatus as any };
    if (!updatedApplicationsByStatus[newStatus]) {
      updatedApplicationsByStatus[newStatus] = [];
    }
    updatedApplicationsByStatus[newStatus].push(updatedApplication);
    
    setApplicationsByStatus(updatedApplicationsByStatus);
    setDraggedItem(null);
    setDraggedOver(null);
  };

  return (
    <div className="p-6">
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {statusColumns.map((column) => (
          <div
            key={column.id}
            className={`flex-shrink-0 w-80 ${
              draggedOver === column.id ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
            } rounded-lg transition-colors`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge className={column.color}>
                {column.count}
              </Badge>
            </div>

            {/* Applications */}
            <div className="space-y-3 min-h-[400px] p-3 bg-gray-50 rounded-b-lg">
              {(applicationsByStatus[column.id] || []).map((application) => (
                <div
                  key={application.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, application)}
                  className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
                    getPriorityColor(application.priority)
                  }`}
                >
                  {/* Company Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-lg">
                        {application.logo}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {application.company}
                        </h4>
                      </div>
                    </div>
                    
                    {application.priority && (
                      <div className={`w-2 h-2 rounded-full ${
                        application.priority === 'high' ? 'bg-red-400' :
                        application.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                    )}
                  </div>

                  {/* Position */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {application.position}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center justify-between">
                      <span>Applied:</span>
                      <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Stipend:</span>
                      <span className="font-medium text-gray-700">{application.stipend}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application.id)}
                      className="flex-1 text-xs"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditApplication(application.id)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Application (only in Applied column) */}
              {column.id === 'Applied' && (
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <span>➕</span>
                    <span className="text-sm">Add Application</span>
                  </div>
                </button>
              )}

              {/* Empty State */}
              {(!applicationsByStatus[column.id] || applicationsByStatus[column.id].length === 0) && column.id !== 'Applied' && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-2xl mb-2">📭</div>
                  <p className="text-sm">No applications</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Drag Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">💡</span>
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Drag and drop applications between columns to update their status. 
            Priority indicators: 🔴 High, 🟡 Medium, 🟢 Low
          </p>
        </div>
      </div>
    </div>
  );
}