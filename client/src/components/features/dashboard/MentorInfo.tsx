// Mentor Information Component
// Displays assigned mentors

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { User } from '@/lib/types';

interface MentorInfoProps {
  mentors: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>[];
}

export function MentorInfo({ mentors }: MentorInfoProps) {
  if (mentors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Your Mentors</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-3xl mb-2">👨‍🏫</div>
            <p className="text-sm text-gray-600">No mentors assigned yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Your Mentors</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mentors.map((mentor) => {
            const initials = mentor.firstName && mentor.lastName
              ? `${mentor.firstName[0]}${mentor.lastName[0]}`.toUpperCase()
              : mentor.email[0].toUpperCase();

            const displayName = mentor.firstName && mentor.lastName
              ? `${mentor.firstName} ${mentor.lastName}`
              : mentor.email;

            return (
              <div 
                key={mentor.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {mentor.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your mentors can provide feedback on your applications
          </p>
        </div>
      </CardContent>
    </Card>
  );
}