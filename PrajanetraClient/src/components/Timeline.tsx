'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

/**
 * Complaint status constants matching backend enum
 */
export const COMPLAINT_STATUSES = {
    SUBMITTED: 'SUBMITTED',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED'
} as const

export type ComplaintStatusType = typeof COMPLAINT_STATUSES[keyof typeof COMPLAINT_STATUSES]

/**
 * Represents an individual step in the timeline.
 * @interface TimelineStep
 * @property {string} label - Display text for the step
 * @property {"completed" | "current" | "pending"} status - Current status of the step
 */
export interface TimelineStep {
    label: string
    status: 'completed' | 'current' | 'pending'
}

/**
 * Props for the Timeline component.
 */
export interface TimelineProps {
    /** Array of steps to display with their labels and status. */
    steps: TimelineStep[]
    /** Optional className for the container */
    className?: string
}

/**
 * Helper function to generate timeline steps from current complaint status
 */
export function generateTimelineSteps(currentStatus: string): TimelineStep[] {
    const statuses = [
        { status: COMPLAINT_STATUSES.SUBMITTED, label: "Submitted" },
        { status: COMPLAINT_STATUSES.ACKNOWLEDGED, label: "Acknowledged" },
        { status: COMPLAINT_STATUSES.UNDER_REVIEW, label: "Under Review" },
        { status: COMPLAINT_STATUSES.IN_PROGRESS, label: "In Progress" },
        { status: COMPLAINT_STATUSES.RESOLVED, label: "Resolved" },
    ]

    const currentIndex = statuses.findIndex(s => s.status === currentStatus)

    return statuses.map((item, index) => ({
        label: item.label,
        status: index <= currentIndex ? 'completed' : index === currentIndex + 1 ? 'current' : 'pending'
    }))
}

/**
 * A timeline component showing sequential step status for complaint tracking.
 * Displays steps with completed, current, and pending states.
 *
 * Features:
 * - Three step states: completed, current, pending
 * - Check icon for completed steps
 * - Responsive horizontal/vertical layout
 * - Connected step indicators
 *
 * @component
 * @example
 * ```tsx
 * <Timeline
 *   steps={[
 *     { label: "Submitted", status: "completed" },
 *     { label: "Acknowledged", status: "completed" },
 *     { label: "Under Review", status: "current" },
 *     { label: "Resolved", status: "pending" }
 *   ]}
 * />
 * ```
 */
export function Timeline({ steps, className }: TimelineProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 bg-card rounded-lg p-4", className)}>
            {steps.map((step, index) => {
                return (
                    <div key={index} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'flex h-5 w-5 items-center justify-center rounded-full text-xs shrink-0',
                                    step.status === 'completed' && 'bg-foreground text-background',
                                    step.status === 'current' && 'border-2 border-foreground',
                                    step.status === 'pending' && 'border border-muted-foreground/40'
                                )}
                            >
                                {step.status === 'completed' && <Check className="h-3 w-3" />}
                            </div>
                            <span
                                className={cn(
                                    'text-xs sm:text-sm',
                                    step.status === 'current' && 'font-medium',
                                    step.status === 'pending' && 'text-muted-foreground'
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="hidden sm:block w-4 h-px bg-border" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
