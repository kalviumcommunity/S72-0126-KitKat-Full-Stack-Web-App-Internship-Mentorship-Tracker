// Students List Component
// Displays list of assigned students for mentors

import Link from 'next/link';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { User } from '@/lib/types';

interface StudentsListProps {
  students: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>[];
}

export function StudentsList({ students }: StudentsListProps) {
  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm text-gray-600">No students assigned yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
          <span className="text-sm text-gray-500">{students.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {students.map((student) => {
            const initials = student.firstName && student.lastName
              ? `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
              : student.email[0].toUpperCase();

            const displayName = student.firstName && student.lastName
              ? `${student.firstName} ${student.lastName}`
              : student.email;

            return (
              <div 
                key={student.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {student.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/mentor/students">
            <Button variant="outline" size="sm" className="w-full">
              View All Students
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}