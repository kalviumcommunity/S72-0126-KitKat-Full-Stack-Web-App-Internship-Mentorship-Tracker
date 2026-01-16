import { cn } from '@/lib/utils';

export interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel = false }: ProgressBarProps) {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex justify-between mb-1">
                {showLabel && (
                    <span className="text-xs font-medium text-blue-700">Uploading...</span>
                )}
                {showLabel && (
                    <span className="text-xs font-medium text-blue-700">{Math.round(clampedValue)}%</span>
                )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${clampedValue}%` }}
                ></div>
            </div>
        </div>
    );
}
