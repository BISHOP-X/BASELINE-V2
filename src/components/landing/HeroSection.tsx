import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroCampus from "@/assets/hero-campus.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background with Ken Burns */}
      <div className="absolute inset-0">
        <img
          src={heroCampus}
          alt="Modern university campus at twilight"
          className="w-full h-full object-cover ken-burns"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_40%_6%/0.7)] via-[hsl(220_40%_6%/0.5)] to-[hsl(220_40%_6%/0.9)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 glass-panel"
        >
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-[hsl(210_30%_92%)]">
            Early Warning System for Babcock University
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl"
        >
          <span className="text-[hsl(210_30%_95%)]">Don't Just Watch{" "}</span>
          <br className="hidden sm:block" />
          <span className="text-[hsl(210_30%_95%)]">Your Grades. </span>
          <span className="text-gradient">Master Them.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 text-lg sm:text-xl max-w-2xl text-[hsl(220_15%_65%)]"
        >
          Real-time academic monitoring that catches problems before they become failures.
          Your academic health, always in focus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link to="/auth">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan px-8 text-base gap-2">
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="border-[hsl(0_0%_100%/0.15)] text-[hsl(210_30%_92%)] hover:bg-[hsl(0_0%_100%/0.05)] px-8 text-base">
              I'm a Lecturer
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
