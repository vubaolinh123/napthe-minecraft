'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className={`${sizeClasses[size]} relative`}>
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" />
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
            </div>
            {text && (
                <p className="text-sm text-gray-400 animate-pulse">{text}</p>
            )}
        </div>
    );
}
