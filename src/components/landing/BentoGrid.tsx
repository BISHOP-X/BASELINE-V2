import { motion } from "framer-motion";
import { BarChart3, Bell, Users } from "lucide-react";
import featureAnalysis from "@/assets/feature-analysis.jpg";
import featureAlerts from "@/assets/feature-alerts.jpg";
import featureConnection from "@/assets/feature-connection.jpg";

const features = [
  {
    title: "Real-Time Analysis",
    description: "Track attendance and grades as they happen. Rule-based thresholds flag risks before they escalate.",
    icon: BarChart3,
    image: featureAnalysis,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Instant Alerts",
    description: "Automated notifications when thresholds are breached. Never miss a warning sign.",
    icon: Bell,
    image: featureAlerts,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Lecturer Connection",
    description: "Bridge the gap between struggling students and their advisors in real time.",
    icon: Users,
    image: featureConnection,
    className: "md:col-span-1 md:row-span-1",
  },
];

const BentoGrid = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Built for <span className="text-gradient">Academic Excellence</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            A proactive check-engine light for student performance — rule-based, real-time, and built for Babcock University.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[260px] sm:auto-rows-[280px]">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`group relative overflow-hidden rounded-2xl border border-border ${feature.className}`}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_40%_6%/0.95)] via-[hsl(220_40%_6%/0.5)] to-transparent" />
              <div className="relative z-10 flex flex-col justify-end h-full p-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-primary/30">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-[hsl(210_30%_95%)]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[hsl(220_15%_65%)] max-w-md">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
