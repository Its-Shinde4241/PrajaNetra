import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Maximize2, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComplaintCardProps {
    complaint: {
        complaintId: string;
        title: string;
        description: string;
        likes: number;
        status: string;
        category: string;
        createdAt: string;
        imageUrls?: string[];
    };
}

export const ComplaintListCard = ({ complaint }: ComplaintCardProps) => {
    const navigate = useNavigate();

    const handleTrack = () => {
        navigate("/track", { state: { complaintId: complaint.complaintId } });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 rounded-lg border bg-card p-3 hover:border-primary/50 transition-colors">
            {/* Image Thumbnail */}
            {complaint.imageUrls && complaint.imageUrls.length > 0 ? (
                <div className="aspect-video sm:aspect-square sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md relative">
                    <img
                        src={complaint.imageUrls[0]}
                        alt={complaint.title}
                        className="h-full w-full object-cover"
                    />
                    {complaint.imageUrls.length > 1 && (
                        <div className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            <Camera className="h-2.5 w-2.5" />
                            {complaint.imageUrls.length}
                        </div>
                    )}
                </div>
            ) : null}

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            {complaint.category && (
                                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                    {complaint.category}
                                </p>
                            )}

                            <h1 className="line-clamp-2 text-sm font-bold leading-tight">
                                {complaint.title}
                            </h1>
                        </div>
                        <button
                            onClick={handleTrack}
                            className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Track complaint"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </button>
                    </div>

                    {complaint.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {complaint.description}
                        </p>
                    )}

                    <div className="mt-1.5 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                            {complaint.status}
                        </Badge>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(complaint.createdAt)}
                        </span>
                    </div>

                    <Button size="sm" onClick={handleTrack}>
                        Track
                    </Button>
                </div>
            </div>
        </div>
    );
};
