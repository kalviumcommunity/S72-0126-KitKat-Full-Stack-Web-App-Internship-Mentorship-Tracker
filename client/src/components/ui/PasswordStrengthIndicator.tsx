// Password Strength Indicator - Visual feedback for password complexity
// Shows password strength with progress bar and requirements checklist

'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';

export interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  weight: number;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
    weight: 2,
  },
  {
    label: 'Contains uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
    weight: 1,
  },
  {
    label: 'Contains lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
    weight: 1,
  },
  {
    label: 'Contains number',
    test: (password: string) => /\d/.test(password),
    weight: 1,
  },
  {
    label: 'Contains special character',
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    weight: 1,
  },
];

const PasswordStrengthIndicator = ({ 
  password, 
  className, 
  showRequirements = true 
}: PasswordStrengthIndicatorProps) => {
  const { strength, score, requirements } = useMemo(() => {
    const metRequirements = passwordRequirements.map(req => ({
      ...req,
      met: req.test(password),
    }));

    const totalScore = metRequirements.reduce(
      (sum, req) => sum + (req.met ? req.weight : 0),
      0
    );
    const maxScore = passwordRequirements.reduce((sum, req) => sum + req.weight, 0);
    const strengthScore = Math.round((totalScore / maxScore) * 100);

    let strengthLevel: 'weak' | 'fair' | 'good' | 'strong';
    if (strengthScore < 30) {
      strengthLevel = 'weak';
    } else if (strengthScore < 60) {
      strengthLevel = 'fair';
    } else if (strengthScore < 90) {
      strengthLevel = 'good';
    } else {
      strengthLevel = 'strong';
    }

    return {
      strength: strengthLevel,
      score: strengthScore,
      requirements: metRequirements,
    };
  }, [password]);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-blue-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'fair':
        return 'Fair';
      case 'good':
        return 'Good';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  };

  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span className={cn(
            'font-medium',
            strength === 'weak' && 'text-red-600',
            strength === 'fair' && 'text-yellow-600',
            strength === 'good' && 'text-blue-600',
            strength === 'strong' && 'text-green-600'
          )}>
            {getStrengthText()}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all duration-300', getStrengthColor())}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1">
          <p className="text-sm text-gray-600 font-medium">Requirements:</p>
          <ul className="space-y-1">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <span className={cn(
                  'text-xs',
                  requirement.met ? 'text-green-500' : 'text-gray-400'
                )}>
                  {requirement.met ? '✅' : '⭕'}
                </span>
                <span className={cn(
                  requirement.met ? 'text-green-600' : 'text-gray-500'
                )}>
                  {requirement.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { PasswordStrengthIndicator };