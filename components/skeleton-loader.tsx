"use client"

import { cn } from "../lib/utils"

interface SkeletonProps {
    className?: string
    variant?: "text" | "card" | "image" | "circular"
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
    const baseClasses = "animate-pulse bg-muted-foreground/10"

    const variantClasses = {
        text: "h-4 w-full rounded",
        card: "h-48 w-full rounded-xl",
        image: "aspect-video w-full rounded-lg",
        circular: "h-12 w-12 rounded-full",
    }

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], className)}
            aria-label="Loading..."
        />
    )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={i === lines - 1 ? "w-3/4" : "w-full"}
                />
            ))}
        </div>
    )
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-4 p-6 border border-border rounded-xl", className)}>
            <Skeleton variant="image" />
            <Skeleton className="h-6 w-3/4" />
            <SkeletonText lines={2} />
        </div>
    )
}
