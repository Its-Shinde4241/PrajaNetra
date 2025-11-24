import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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
    <div className="min-h-screen relative">
      {/* Static blur gradient background overlay - NO ANIMATIONS */}
      <div className="absolute inset-0 bg-linear-to-br from-background/90 via-background/85 to-background/80 " />

      {/* Content - WITH ANIMATIONS */}
      <motion.div
        className="relative z-10 pt-24 pb-12 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            className="container mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }} // Much faster, no delay
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }} // Reduced delay
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                File a Complaint
              </h1>
              <p className="text-muted-foreground">
                Help us serve you better by reporting issues in your area
              </p>
            </motion.div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4
            }}
          >
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.6
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <FileText className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span>Complaint Details</span>
                  </CardTitle>
                  <CardDescription>
                    Please provide accurate information for faster resolution
                  </CardDescription>
                </CardHeader>
              </motion.div>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <motion.div
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.8
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 0.9
                        }}
                      >
                        <Label htmlFor="name" className="flex items-center space-x-2">
                          <span>Nick Name</span>
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="transition-all duration-300 focus:scale-105 hover:shadow-md"
                        />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 10, opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 1.0
                        }}
                      >
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
                          className="transition-all duration-300 focus:scale-105 hover:shadow-md"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      className="space-y-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.1
                      }}
                    >
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
                        className="transition-all duration-300 focus:scale-105 hover:shadow-md"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Complaint Information */}
                  <motion.div
                    className="space-y-4 pt-4 border-t border-border/50"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 1.2
                    }}
                  >
                    <motion.div
                      className="space-y-2"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.3
                      }}
                    >
                      <Label htmlFor="category">
                        Complaint Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        required
                        value={formData.category}
                        onValueChange={(value) => handleChange("category", value)}
                      >
                        <SelectTrigger className="transition-all duration-300 focus:scale-105 hover:shadow-md">
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
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.4
                      }}
                    >
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
                        className="transition-all duration-300 focus:scale-105 hover:shadow-md"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.5
                      }}
                    >
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
                        className="transition-all duration-300 focus:scale-105 hover:shadow-md resize-none"
                      />
                    </motion.div>

                    {/* Image Upload */}
                    <motion.div
                      className="space-y-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 1.6
                      }}
                    >
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
                    </motion.div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ y: 30, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 1.7
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full relative overflow-hidden"
                        disabled={isSubmitting}
                      >
                        <motion.span
                          animate={isSubmitting ? { opacity: 0 } : { opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Complaint"}
                        </motion.span>
                        {isSubmitting && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileComplaint;