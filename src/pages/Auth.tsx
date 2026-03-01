import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, Eye, EyeOff, ShieldCheck, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import authLibrary from "@/assets/auth-library.jpg";
import authBoardroom from "@/assets/auth-boardroom.jpg";

type Role = "student" | "lecturer" | "admin";

const Auth = () => {
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login("demo@babcock.edu.ng", "password", role);
    const routes: Record<Role, string> = {
      student: "/dashboard",
      lecturer: "/lecturer",
      admin: "/admin",
    };
    navigate(routes[role]);
  };

  return (
    <div className="flex h-screen">
      {/* Left: Editorial Image */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={role}
            src={role === "student" ? authLibrary : authBoardroom}
            alt={role === "student" ? "University library" : "Modern boardroom"}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[hsl(220_40%_6%/0.3)]" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="glass-panel p-6">
            <p className="text-lg font-medium text-[hsl(210_30%_95%)]">
              {role === "student"
                ? "\"Baseline helped me catch my attendance drop before it was too late.\""
                : role === "lecturer"
                ? "\"I can now intervene weeks before a student fails.\""
                : "\"Full visibility into student performance across all departments.\""}
            </p>
            <p className="mt-2 text-sm text-[hsl(220_15%_65%)]">
              {role === "student"
                ? "— Final Year, Computer Science"
                : role === "lecturer"
                ? "— Dr. Adeyemi, Faculty of Sciences"
                : "— Registry Office, Babcock University"}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-navy p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-cyan">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-[hsl(210_30%_95%)]">Baseline</span>
          </Link>

          <h1 className="text-3xl font-bold text-[hsl(210_30%_95%)]">Welcome back</h1>
          <p className="mt-2 text-[hsl(220_15%_55%)]">Sign in to your academic dashboard</p>

          {/* Role Toggle */}
          <div className="mt-8 flex rounded-xl bg-[hsl(220_30%_12%)] p-1">
            {(["student", "lecturer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                  role === r
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-[hsl(220_15%_55%)] hover:text-[hsl(210_30%_80%)]"
                }`}
              >
                {r === "admin" ? (
                  <span className="flex items-center justify-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Admin</span>
                ) : r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220_15%_45%)]" />
              <input
                type="email"
                placeholder={
                  role === "student" ? "student@babcock.edu.ng"
                  : role === "lecturer" ? "lecturer@babcock.edu.ng"
                  : "admin@babcock.edu.ng"
                }
                className="w-full pl-11 pr-4 py-3 glass-input text-[hsl(210_30%_92%)] placeholder:text-[hsl(220_15%_35%)]"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220_15%_45%)]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-11 pr-12 py-3 glass-input text-[hsl(210_30%_92%)] placeholder:text-[hsl(220_15%_35%)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(220_15%_45%)] hover:text-[hsl(210_30%_80%)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {role === "student" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220_15%_45%)]" />
                <input
                  type="text"
                  placeholder="Matric Number (e.g. 20/0547)"
                  className="w-full pl-11 pr-4 py-3 glass-input text-[hsl(210_30%_92%)] placeholder:text-[hsl(220_15%_35%)]"
                />
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan py-3 text-base font-semibold"
            >
              Sign In
            </Button>
          </form>

          {/* Mock login hint */}
          <div className="mt-6 p-3 rounded-xl bg-[hsl(220_30%_12%)] border border-[hsl(220_30%_18%)]">
            <p className="text-xs text-[hsl(220_15%_50%)] text-center">
              <span className="text-primary font-semibold">Demo Mode:</span> Select a role tab and click Sign In with any credentials.
            </p>
          </div>

          <p className="mt-4 text-center text-sm text-[hsl(220_15%_45%)]">
            Don't have an account?{" "}
            <span className="text-primary cursor-pointer hover:underline">Contact your admin</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
