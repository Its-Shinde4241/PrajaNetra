import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Search, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Overlay for Hero content readability */}
      <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/80 to-background/60" />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-scale-in">
            Your Voice Matters
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Report civic issues directly to the Municipal Corporation. From road
            repairs to sanitation concerns, we're here to make your city better,
            one complaint at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/complaint" className="hover-scale">
              <Button size="lg" className="w-full sm:w-auto group">
                <FileText className="w-5 h-5 mr-2" />
                File a Complaint
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/track" className="hover-scale">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Track Status
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-border">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Always Available</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-3xl font-bold text-primary mb-1">5000+</div>
              <div className="text-sm text-muted-foreground">Issues Resolved</div>
            </div>
            <div className="animate-fade-in col-span-2 md:col-span-1" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold text-primary mb-1">48hrs</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;