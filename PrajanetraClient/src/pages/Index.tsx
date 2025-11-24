import Features from "@/components/Features";
import Hero from "@/components/Hero";
import heroImage from "@/assets/hero-city.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Image - Better approach */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Optional: Add overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        <Hero />
        <Features />

        {/* Footer */}
        <footer className="bg-background/95 backdrop-blur-sm text-foreground py-8 border-t border-border/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm">
                © 2025 Municipal Corporation. All rights reserved.
              </p>
              <p className="text-sm mt-2 opacity-80">
                Making our city better, together.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;