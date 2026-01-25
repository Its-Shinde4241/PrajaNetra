import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Search, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Static Overlay for Hero content readability - NO ANIMATIONS */}
      <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/70 to-background/60 " />

      {/* Content - WITH ANIMATIONS */}
      <motion.div
        className="container mx-auto px-4 py-40 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          className="max-w-3xl"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.4
            }}
          >
            Your Voice Matters
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.6
            }}
          >
            Report civic issues directly to the Municipal Corporation. From road
            repairs to sanitation concerns, we're here to make your city better,
            one complaint at a time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }} // Much faster
          >
            <Link to="/complaint">
              <Button size="lg" className="w-full sm:w-auto group transform transition-transform hover:scale-105 active:scale-95">
                <FileText className="w-5 h-5 mr-2" />
                File a Complaint
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to="/track">
              <Button size="lg" variant="outline" className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95">
                <Search className="w-5 h-5 mr-2" />
                Track Status
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-border"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 1.0
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 1.1
              }}
            >
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Always Available</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 1.2
              }}
            >
              <div className="text-3xl font-bold text-primary mb-1">5000+</div>
              <div className="text-sm text-muted-foreground">Issues Resolved</div>
            </motion.div>

            <motion.div
              className="col-span-2 md:col-span-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 1.3
              }}
            >
              <div className="text-3xl font-bold text-primary mb-1">48hrs</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 1.4
          }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-primary flex items-start justify-center p-2"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="w-1 h-3 bg-primary rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;