// Students List View Component
// Compact list layout for students

'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: string;
  gpa: number;
  applications: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
}

interface StudentsListViewProps {
  students: Student[];
  onStudentSelect: (student: Student) => void;
  selectedStudent?: Student;
}

export function StudentsListView({ students: propStudents, onStudentSelect, selectedStudent }: StudentsListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  // Mock data if no students provided
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@ucla.edu',
      program: 'Computer Science',
      year: 'Junior',
      gpa: 3.8,
      applications: 12,
      lastActive: '2 days ago',
      status: 'active',
      avatar: '👩‍💻'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@stanford.edu',
      program: 'Computer Science',
      year: 'Senior',
      gpa: 3.9,
      applications: 8,
      lastActive: '1 day ago',
      status: 'active',
      avatar: '👨‍💼'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@berkeley.edu',
      program: 'Data Science',
      year: 'Sophomore',
      gpa: 3.6,
      applications: 5,
      lastActive: '1 week ago',
      status: 'inactive',
      avatar: '👩‍🎓'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@mit.edu',
      program: 'Electrical Engineering',
      year: 'Junior',
      gpa: 3.7,
      applications: 15,
      lastActive: '3 days ago',
      status: 'active',
      avatar: '👨‍💻'
    },
    {
      id: '5',
      name: 'Jessica Wang',
      email: 'jessica.wang@cmu.edu',
      program: 'Software Engineering',
      year: 'Senior',
      gpa: 3.95,
      applications: 6,
      lastActive: '4 hours ago',
      status: 'active',
      avatar: '👩‍💼'
    }
  ];

  const students = propStudents.length > 0 ? propStudents : mockStudents;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
          <div className="text-sm text-gray-500">
            {filteredStudents.length} of {students.length} students
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="divide-y divide-gray-200">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => onStudentSelect(student)}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedStudent?.id === student.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {student.avatar}
                </div>

                {/* Student Info */}
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{student.email}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{student.program} • {student.year}</span>
                    <span>•</span>
                    <span>GPA: {student.gpa}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {student.applications}
                </div>
                <div className="text-sm text-gray-500">Applications</div>
                <div className="text-xs text-gray-400 mt-1">
                  Last active: {student.lastActive}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 text-lg mb-2">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No students have been assigned to you yet'
            }
          </p>
        </div>
      )}
    </div>
  );
}