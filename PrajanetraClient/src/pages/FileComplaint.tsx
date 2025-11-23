import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { MapPin, FileText, Phone, Mail } from "lucide-react";

const FileComplaint = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    location: "",
    description: "",
    images: [] as File[],
  });

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const categories = [
    "Road & Infrastructure",
    "Water Supply",
    "Garbage Collection",
    "Street Lights",
    "Drainage",
    "Public Property",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a random complaint ID
    const complaintId = `MCP${Date.now().toString().slice(-8)}`;

    setIsSubmitting(false);
    toast.success("Complaint filed successfully!", {
      description: `Your complaint ID is ${complaintId}. You can track it anytime.`,
    });

    // Navigate to track page after a delay
    setTimeout(() => {
      navigate("/track-complaint", { state: { complaintId } });
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              File a Complaint
            </h1>
            <p className="text-muted-foreground">
              Help us serve you better by reporting issues in your area
            </p>
          </div>

          <Card className="animate-scale-in border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Complaint Details</span>
              </CardTitle>
              <CardDescription>
                Please provide accurate information for faster resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center space-x-2">
                        <span>Full Name</span>
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="transition-all focus:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="transition-all focus:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="transition-all focus:scale-105"
                    />
                  </div>
                </div>

                {/* Complaint Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Complaint Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger className="transition-all focus:scale-105">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location/Address</span>
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="Enter the location of the issue"
                      required
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="transition-all focus:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue in detail..."
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="transition-all focus:scale-105 resize-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Incident Photos <span className="text-destructive">*</span>
                    </Label>
                    <FileUpload

                      onChange={handleFileUpload}
                      onRemove={handleRemoveFile}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your photos help us resolve the issue faster. You can upload multiple images. Your identity remains protected.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full hover-scale"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FileComplaint;
