// Feedback Priority Badge Component
// Displays feedback priority with consistent styling

import { Badge } from '@/components/ui/Badge';
import { FeedbackPriority, FEEDBACK_PRIORITY_CONFIG } from '@/lib/types';

interface FeedbackPriorityBadgeProps {
  priority: FeedbackPriority;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  HIGH: '🔴',
  MEDIUM: '🟡',
  LOW: '🟢',
};

export function FeedbackPriorityBadge({ 
  priority, 
  showIcon = false,
  size = 'md'
}: FeedbackPriorityBadgeProps) {
  const config = FEEDBACK_PRIORITY_CONFIG[priority];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge 
      variant={config.color === 'red' ? 'destructive' : 'secondary'}
      className={sizeClasses[size]}
    >
      {showIcon && <span className="mr-1">{iconMap[priority]}</span>}
      {config.label}
    </Badge>
  );
}