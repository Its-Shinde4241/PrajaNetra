import Features from "@/components/Features";
import Hero from "@/components/Hero";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />

      {/* Footer */}
      <footer className="bg-background/95 backdrop-blur-sm text-foreground py-8 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              © 2026 Municipal Corporation. All rights reserved.
            </p>
            <p className="text-sm mt-2 opacity-80">
              Making city better, together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;