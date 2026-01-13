// Application Status Badge component - Server/Client Component
// Displays application status with appropriate styling

import { Badge } from '@/components/ui/Badge';
import type { ApplicationStatus } from '@/lib/types';
import { APPLICATION_STATUS_CONFIG } from '@/lib/types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ApplicationStatusBadge({ 
  status, 
  showIcon = false,
  size = 'md' 
}: ApplicationStatusBadgeProps) {
  const config = APPLICATION_STATUS_CONFIG[status];
  
  const getVariant = (color: string) => {
    switch (color) {
      case 'gray': return 'neutral';
      case 'blue': return 'info';
      case 'yellow': return 'warning';
      case 'green': return 'success';
      case 'red': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'DRAFT': return '📝';
      case 'APPLIED': return '📤';
      case 'SHORTLISTED': return '⭐';
      case 'INTERVIEW': return '🎯';
      case 'OFFER': return '🎉';
      case 'REJECTED': return '❌';
      default: return '📋';
    }
  };

  return (
    <Badge 
      variant={getVariant(config.color)} 
      size={size}
      dot={!showIcon}
      className="font-medium"
    >
      {showIcon && (
        <span className="mr-1">{getStatusIcon(status)}</span>
      )}
      {config.label}
    </Badge>
  );
}