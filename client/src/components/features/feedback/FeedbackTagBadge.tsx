// Feedback Tag Badge Component
// Displays feedback tags with consistent styling

import { Badge } from '@/components/ui/Badge';
import { FeedbackTag, FEEDBACK_TAG_CONFIG } from '@/lib/types';

interface FeedbackTagBadgeProps {
  tag: FeedbackTag;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  RESUME: '📄',
  DSA: '💻',
  SYSTEM_DESIGN: '🏗️',
  COMMUNICATION: '💬',
};

export function FeedbackTagBadge({ 
  tag,
  size = 'md'
}: FeedbackTagBadgeProps) {
  const config = FEEDBACK_TAG_CONFIG[tag];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge 
      variant="outline"
      className={sizeClasses[size]}
    >
      <span className="mr-1">{iconMap[tag]}</span>
      {config.label}
    </Badge>
  );
}