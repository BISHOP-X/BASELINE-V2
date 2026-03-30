import HeroSection from "@/components/landing/HeroSection";
import BentoGrid from "@/components/landing/BentoGrid";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <BentoGrid />
      <LandingFooter />
      <PwaInstallPrompt />
    </div>
  );
};

export default Index;
