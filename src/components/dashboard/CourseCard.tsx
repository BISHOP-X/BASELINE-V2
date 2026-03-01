import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface CourseCardProps {
  code: string;
  title: string;
  grade: number;
  attendance: number;
  trend: "up" | "down" | "stable";
  gradient: string;
  delay?: number;
}

const CourseCard = ({ code, title, grade, attendance, trend, gradient, delay = 0 }: CourseCardProps) => {
  const isCritical = attendance < 60;
  const isAtRisk = !isCritical && (attendance < 75 || grade < 40);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-2xl border ${isCritical ? "border-danger/60 breathe-red" : isAtRisk ? "border-danger/40 breathe-red" : "border-border"} bg-card`}
    >
      {/* Abstract gradient header */}
      <div className={`h-24 ${gradient} relative`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_0%_100%/0.15),transparent)]" />
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[hsl(0_0%_0%/0.3)] backdrop-blur-sm">
          <span className="text-xs font-mono font-semibold text-[hsl(210_30%_95%)]">{code}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Grade</p>
            <p className={`text-2xl font-bold font-mono ${grade < 40 ? "text-danger" : "text-foreground"}`}>
              {grade}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Attendance</p>
            <p className={`text-2xl font-bold font-mono ${attendance < 75 ? "text-danger" : "text-foreground"}`}>
              {attendance}%
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <TrendIcon className={`w-4 h-4 ${trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-muted-foreground"}`} />
          <span className="text-xs text-muted-foreground">
            {trend === "up" ? "Improving" : trend === "down" ? "Declining" : "Stable"}
          </span>
          {(isCritical || isAtRisk) && (
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${isCritical ? "text-danger bg-danger/20" : "text-danger bg-danger/10"}`}>
              {isCritical ? "🔴 Critical" : "⚠ At Risk"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
