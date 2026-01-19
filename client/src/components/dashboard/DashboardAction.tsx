'use client';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { ButtonHTMLAttributes } from 'react';

interface DashboardActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    toastTitle: string;
    toastMessage?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DashboardAction({
    label,
    toastTitle,
    toastMessage,
    onClick,
    ...props
}: DashboardActionProps) {
    const { success } = useToast();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        success(toastTitle, toastMessage);
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Button onClick={handleClick} {...props}>
            {label}
        </Button>
    );
}
