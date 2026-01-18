import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
    children: ReactNode
    className?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
}

/**
 * Page container with consistent padding and max-width
 */
export function PageContainer({
    children,
    className,
    maxWidth = '7xl'
}: PageContainerProps) {
    return (
        <div className="min-h-screen bg-background">
            <div
                className={cn(
                    'mx-auto px-4 sm:px-6 lg:px-8 py-8',
                    maxWidthClasses[maxWidth],
                    className
                )}
            >
                {children}
            </div>
        </div>
    )
}

interface PageHeaderProps {
    title: string
    description?: string
    children?: ReactNode
}

/**
 * Standard page header component
 */
export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {children && (
                    <div className="flex items-center gap-2">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}
