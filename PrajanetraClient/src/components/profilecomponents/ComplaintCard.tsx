import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface ComplaintCardProps {
    complaint: {
        complaintId: string;
        title: string;
        description: string;
        status: string;
        category: string;
        createdAt: string;
        imageUrls?: string[];
    };
}

export const ComplaintCard = ({ complaint }: ComplaintCardProps) => {
    return (
        <Card className="border-border/30 hover:border-primary/50 transition-colors cursor-pointer py-3">
            <CardContent className="pt-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <h3 className="font-semibold truncate">{complaint.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {complaint.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant="outline">{complaint.status}</Badge>
                            <Badge variant="secondary">{complaint.category}</Badge>
                        </div>
                    </div>
                    {complaint.imageUrls && complaint.imageUrls.length > 0 && (
                        <div className="flex flex-col gap-2 shrink-0">
                            <div className="flex gap-1">
                                {complaint.imageUrls.slice(0, 2).map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className="w-16 h-16 rounded-md overflow-hidden border border-border"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Complaint image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                {complaint.imageUrls.length > 2 && (
                                    <div className="w-16 h-16 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            +{complaint.imageUrls.length - 2}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="text-muted-foreground text-xs text-center">
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
