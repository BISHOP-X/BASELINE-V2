import { motion } from "framer-motion";
import { useMemo } from "react";

interface RiskGaugeProps {
  score: number; // 0-100
  label: string;
}

const RiskGauge = ({ score, label }: RiskGaugeProps) => {
  const status = useMemo(() => {
    if (score >= 75) return { color: "hsl(145, 63%, 42%)", glowClass: "breathe-green", text: "On Track", textColor: "text-success" };
    if (score >= 50) return { color: "hsl(38, 92%, 50%)", glowClass: "", text: "At Risk", textColor: "text-warning" };
    return { color: "hsl(0, 72%, 51%)", glowClass: "breathe-red", text: "Critical", textColor: "text-danger" };
  }, [score]);

  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (score / 100) * circumference * 0.75; // 270 degree arc

  return (
    <div className={`flex flex-col items-center p-8 rounded-2xl bg-card border border-border ${status.glowClass}`}>
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="hsl(220, 30%, 15%)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
          />
          {/* Value arc */}
          <motion.circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke={status.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${status.color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold text-foreground font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={`text-sm font-semibold mt-1 ${status.textColor}`}>{status.text}</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
};

export default RiskGauge;
