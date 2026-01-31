'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ThumbsUp, MapPin, Calendar } from 'lucide-react'
import type { Complaint } from '@/store/complaintStore'

export interface ComplaintCardProps {
    data?: {
        complaint?: Complaint
    }
    actions?: {
        onViewDetails?: (complaint: Complaint) => void
        onLike?: (complaintId: string) => void
    }
    appearance?: {
        /**
         * Card layout variant.
         * @default "default"
         */
        variant?: 'default' | 'compact' | 'horizontal' | 'covered'
        /**
         * Whether to show the cover images carousel.
         * @default true
         */
        showImages?: boolean
        /**
         * Whether to show the status badge.
         * @default true
         */
        showStatus?: boolean
        /**
         * Whether to show the category label.
         * @default true
         */
        showCategory?: boolean
        /**
         * Whether to show the like button.
         * @default true
         */
        showLikes?: boolean
    }
}

/**
 * A complaint card component with multiple layout variants.
 * Supports default, compact, horizontal, and covered (overlay) styles.
 *
 * Features:
 * - Four layout variants (default, compact, horizontal, covered)
 * - Image carousel with navigation
 * - Status badge with color coding
 * - Category and location display
 * - Like action button
 * - Responsive design
 *
 * @component
 * @example
 * ```tsx
 * <ComplaintCard
 *   data={{
 *     complaint: {
 *       complaintId: "123",
 *       title: "Pothole on Main Street",
 *       description: "Large pothole causing traffic issues",
 *       category: "Road & Infrastructure",
 *       location: "Main Street, Sector 5",
 *       status: "IN_PROGRESS",
 *       likes: 45,
 *       imageUrls: ["url1", "url2"],
 *       createdAt: "2024-01-15",
 *       updatedAt: "2024-01-20"
 *     }
 *   }}
 *   actions={{
 *     onViewDetails: (complaint) => console.log("View:", complaint.complaintId),
 *     onLike: (id) => console.log("Like:", id)
 *   }}
 *   appearance={{
 *     variant: "default",
 *     showImages: true,
 *     showStatus: true,
 *     showCategory: true,
 *     showLikes: true
 *   }}
 * />
 * ```
 */
export function ComplaintCard({ data, actions, appearance }: ComplaintCardProps) {
    const complaint = data?.complaint
    if (!complaint) return null

    const onViewDetails = actions?.onViewDetails
    const onLike = actions?.onLike
    const variant = appearance?.variant ?? 'default'
    const showImages = appearance?.showImages ?? true
    const showStatus = appearance?.showStatus ?? true
    const showCategory = appearance?.showCategory ?? true
    const showLikes = appearance?.showLikes ?? true

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(complaint)
        }
    }

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onLike) {
            onLike(complaint.complaintId)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        const upperStatus = status.toUpperCase()
        if (upperStatus === 'RESOLVED') return 'bg-green-500'
        if (upperStatus === 'IN_PROGRESS' || upperStatus === 'UNDER_REVIEW') return 'bg-blue-500'
        if (upperStatus === 'ACKNOWLEDGED') return 'bg-yellow-500'
        return 'bg-gray-500'
    }

    const getStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }

    const ImageCarousel = ({ images, className = '', showLocationBadge = true }: { images: string[], className?: string, showLocationBadge?: boolean }) => {
        if (!images || images.length === 0) {
            return (
                <div className={`bg-muted flex items-center justify-center ${className}`}>
                    <p className="text-sm text-muted-foreground">No images</p>
                </div>
            )
        }

        if (images.length === 1) {
            return (
                <div className={`relative overflow-hidden ${className}`}>
                    <img
                        src={images[0]}
                        alt={complaint.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                    {showLocationBadge && (
                        <Badge variant="outline" className="absolute bottom-2 right-2 bg-black/60 text-white border-0 backdrop-blur-sm z-10">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1 max-w-[150px]">{complaint.location}</span>
                        </Badge>
                    )}
                </div>
            )
        }

        return (
            <div className="relative">
                <Carousel className={className}>
                    <CarouselContent>
                        {images.map((imageUrl, index) => (
                            <CarouselItem key={index}>
                                <img
                                    src={imageUrl}
                                    alt={`${complaint.title} - Image ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>
                {showLocationBadge && (
                    <Badge variant="default" className="absolute bottom-4 bg-accent right-4 border-0 text-primary backdrop-blur-sm z-10">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1 max-w-[150px]">{complaint.location}</span>
                    </Badge>
                )}
            </div>
        )
    }

    if (variant === 'covered') {
        return (
            <div className="relative overflow-hidden rounded-lg border">
                <div className="min-h-[280px] sm:aspect-video sm:min-h-0 w-full">
                    {showImages && complaint.imageUrls && complaint.imageUrls.length > 0 ? (
                        <ImageCarousel images={complaint.imageUrls} className="absolute inset-0 h-full w-full" />
                    ) : (
                        <div className="absolute inset-0 h-full w-full bg-muted" />
                    )}
                </div>
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <div>
                        {showCategory && (
                            <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">
                                {complaint.category}
                            </p>
                        )}
                        {showStatus && (
                            <Badge className={`${getStatusColor(complaint.status)} text-white text-xs mb-2`}>
                                {getStatusLabel(complaint.status)}
                            </Badge>
                        )}
                        <h2 className="mt-1 text-lg font-semibold leading-tight">
                            {complaint.title}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm text-white/80">
                            {complaint.description}
                        </p>
                        {showLikes && (
                            <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
                                <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    {complaint.likes}
                                </span>
                            </div>
                        )}
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(complaint.createdAt)}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-full sm:w-auto"
                                onClick={handleViewDetails}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'horizontal') {
        return (
            <div className="flex flex-col sm:flex-row gap-4 rounded-lg border bg-card p-3">
                {showImages && complaint.imageUrls && complaint.imageUrls.length > 0 && (
                    <div className="aspect-video sm:aspect-square sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md">
                        <ImageCarousel images={complaint.imageUrls} className="h-full w-full" />
                    </div>
                )}
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        {showCategory && (
                            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                {complaint.category}
                            </p>
                        )}
                        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                            {complaint.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {complaint.description}
                        </p>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            {showStatus && (
                                <Badge className={`${getStatusColor(complaint.status)} text-white text-xs`}>
                                    {getStatusLabel(complaint.status)}
                                </Badge>
                            )}
                            {showLikes && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs"
                                    onClick={handleLike}
                                >
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {complaint.likes}
                                </Button>
                            )}
                        </div>
                        <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={handleViewDetails}
                        >
                            View
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="flex h-full flex-col justify-between rounded-lg border bg-card p-3">
                <div>
                    {showCategory && (
                        <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {complaint.category}
                        </p>
                    )}
                    <h3 className="line-clamp-2 text-sm font-medium">{complaint.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {complaint.description}
                    </p>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        {showStatus && (
                            <Badge className={`${getStatusColor(complaint.status)} text-white text-xs`}>
                                {getStatusLabel(complaint.status)}
                            </Badge>
                        )}
                        {showLikes && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={handleLike}
                            >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {complaint.likes}
                            </Button>
                        )}
                    </div>
                    <Button size="sm" onClick={handleViewDetails}>
                        View Details
                    </Button>
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
            {showImages && complaint.imageUrls && complaint.imageUrls.length > 0 && (
                <div className="aspect-video overflow-hidden">
                    <ImageCarousel images={complaint.imageUrls} className="h-full w-full" />
                </div>
            )}
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    <div className='flex justify-between'>
                        {showCategory && (
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                {complaint.category}
                            </p>
                        )}
                        {showStatus && (
                            <Badge className={`${getStatusColor(complaint.status)} text-white text-xs mb-2`}>
                                {getStatusLabel(complaint.status)}
                            </Badge>
                        )}
                    </div>
                    <div>

                        <h3 className="line-clamp-2 font-medium">{complaint.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {complaint.description}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            {/* <Calendar className="w-3 h-3" /> */}
                            {formatDate(complaint.createdAt)}
                        </span>
                        {showLikes && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={handleLike}
                            >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {complaint.likes}
                            </Button>
                        )}
                    </div>
                    <Button size="sm" onClick={handleViewDetails}>
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    )
}
