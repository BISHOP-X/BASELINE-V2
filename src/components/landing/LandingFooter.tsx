import { Activity } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Baseline</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 Babcock University. Academic Early Warning System.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
