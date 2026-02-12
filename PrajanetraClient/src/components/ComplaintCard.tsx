'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Flag, Link, MapPin, SearchCode, Share2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Complaint } from '@/store/complaintStore'

export interface ComplaintCardProps {
    complaint: Complaint
    actions?: {
        onViewDetails?: (complaint: Complaint) => void
        onLike?: (complaintId: string) => void
        onComment?: (complaintId: string) => void
        onShare?: (complaintId: string) => void
        onSave?: (complaintId: string) => void
    }
}


export function ComplaintCard({ complaint, actions }: ComplaintCardProps) {
    console.log('Rendering ComplaintCard for complaint:', complaint)
    if (!complaint) return null

    const onViewDetails = actions?.onViewDetails
    const onLike = actions?.onLike
    const onComment = actions?.onComment
    const onShare = actions?.onShare
    const onSave = actions?.onSave

    // Static user data (to be replaced with actual user data later)
    const staticUser = {
        username: "citizen.reporter",
        avatar: "CR",
        verified: false
    }

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onLike) {
            onLike(complaint.complaintId)
        }
    }

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onComment) {
            onComment(complaint.complaintId)
        }
    }

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onShare) {
            onShare(complaint.complaintId)
        }
    }

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onSave) {
            onSave(complaint.complaintId)
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'just now'
        if (diffInHours < 24) return `${diffInHours} hours ago`
        if (diffInHours < 48) return '1 day ago'
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        const upperStatus = status.toUpperCase()
        if (upperStatus === 'RESOLVED') return 'bg-green-500'
        if (upperStatus === 'REJECTED') return 'bg-red-500'
        if (upperStatus === 'IN_PROGRESS') return 'bg-blue-500'
        if (upperStatus === 'UNDER_REVIEW') return 'bg-orange-500'
        if (upperStatus === 'ACKNOWLEDGED') return 'bg-yellow-500'
        if (upperStatus === 'SUBMITTED') return 'bg-gray-500'
        return 'bg-gray-500'
    }

    const getStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }

    return (
        <div className="w-full max-w-[470px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[630px] mx-auto rounded-xl border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
                        <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-xs font-semibold">
                            {staticUser.avatar}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">{staticUser.username}</span>
                        {staticUser.verified && (
                            <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                            </svg>
                        )}
                        <Badge className={`${getStatusColor(complaint.status)} text-white text-xs ml-2`}>
                            {getStatusLabel(complaint.status)}
                        </Badge>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
                            aria-label="More options"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Flag className="mr-2 h-4 w-4" />
                            Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link className="mr-2 h-4 w-4" />
                            Copy link
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Image Carousel */}
            <div className="bg-muted relative w-full h-[450px] overflow-hidden">
                {complaint.imageUrls && complaint.imageUrls.length > 0 ? (
                    complaint.imageUrls.length === 1 ? (
                        <img
                            src={complaint.imageUrls[0]}
                            alt={complaint.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                                {complaint.imageUrls.map((imageUrl, index) => (
                                    <CarouselItem key={index} className="h-full">
                                        <img
                                            src={imageUrl}
                                            alt={`${complaint.title} - Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">No images</p>
                    </div>
                )}
                {/* Location Badge */}
                {complaint.formattedAddress && (
                    <Badge variant="outline" className="absolute bottom-2 right-2 bg-black/60 text-white border-0 backdrop-blur-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1 max-w-[150px]">{complaint.formattedAddress}</span>
                    </Badge>
                )}
            </div>

            {/* Actions and Content */}
            <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="hover:text-muted-foreground transition-colors cursor-pointer"
                            onClick={handleLike}
                            aria-label="Like complaint"
                        >
                            <Heart className="h-6 w-6" />
                        </button>
                        <button
                            className="hover:text-muted-foreground transition-colors cursor-pointer"
                            onClick={handleComment}
                            aria-label="Comment on complaint"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </button>
                        <button
                            className="hover:text-muted-foreground transition-colors cursor-pointer"
                            onClick={handleShare}
                            aria-label="Share complaint"
                        >
                            <SearchCode className="h-6 w-6" />
                        </button>
                    </div>
                    <button
                        className="hover:text-muted-foreground transition-colors cursor-pointer"
                        onClick={handleSave}
                        aria-label="Save complaint"
                    >
                        <Bookmark className="h-6 w-6" />
                    </button>
                </div>

                <p className="font-semibold text-sm">{complaint.likes} likes</p>

                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="font-semibold">{complaint.category}</span>
                        {" • "}
                        <span className="font-medium">{complaint.title}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {complaint.description}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{formatDate(complaint.createdAt)}</p>
                    {onViewDetails && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto py-1"
                            onClick={() => onViewDetails(complaint)}
                        >
                            View Details
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
