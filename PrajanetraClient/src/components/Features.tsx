import { Clock, Shield, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import citizensIcon from "@/assets/citizens-icon.png";

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "Get updates on your complaints within 48 hours",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your information is encrypted and protected",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description: "Receive notifications at every stage of resolution",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor the status of your complaint in real-time",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-background/60 via-background/85 to-background/95">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We Serve You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy for citizens to report issues and track their
            resolution efficiently
          </p>
        </div>

        {/* Citizens Image */}
        <div className="flex justify-center mb-16 animate-scale-in">
          <img
            src={citizensIcon}
            alt="Citizens engagement"
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover-scale animate-fade-in border-border hover:shadow-lg transition-all duration-300 bg-background/90"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;