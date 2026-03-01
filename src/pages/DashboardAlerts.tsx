import { motion } from "framer-motion";
import { Activity, Bell, ArrowLeft, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockAlerts } from "@/lib/mock-data";

const DashboardAlerts = () => {
  return (
    <div className="min-h-screen bg-navy dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-navy/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Baseline</span>
          </div>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-danger" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Risk Alerts</h1>
              <p className="text-sm text-muted-foreground">
                {mockAlerts.filter(a => !a.is_read).length} unread alerts
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {mockAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-5 rounded-2xl border ${
                !alert.is_read
                  ? alert.severity === "critical"
                    ? "border-danger/40 bg-danger/5"
                    : "border-warning/40 bg-warning/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${
                  alert.severity === "critical" ? "text-danger" : "text-warning"
                }`}>
                  {alert.severity === "critical" ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      alert.severity === "critical"
                        ? "bg-danger/20 text-danger"
                        : "bg-warning/20 text-warning"
                    }`}>
                      {alert.severity === "critical" ? "Critical" : "At Risk"}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {alert.course?.code}
                    </span>
                    {alert.is_read && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                    )}
                    {!alert.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary ml-auto shrink-0" />
                    )}
                  </div>
                  <p className="mt-2 text-sm text-foreground font-medium">
                    {alert.course?.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {alert.trigger_reason}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardAlerts;
