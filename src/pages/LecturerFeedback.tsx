import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, LogOut, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockFeedbackThreads, mockAllStudents } from "@/lib/mock-data";

const LecturerFeedback = () => {
  const { logout } = useAuth();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const activeThread = mockFeedbackThreads.find(t => t.id === selectedThread);

  const getStudentName = (id: string) => mockAllStudents.find(s => s.id === id)?.full_name || "Unknown";

  return (
    <div className="min-h-screen bg-navy dark">
      <header className="sticky top-0 z-50 border-b border-border bg-navy/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Baseline</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Lecturer</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/lecturer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                <ArrowLeft className="w-4 h-4" /> Courses
              </Button>
            </Link>
            <Link to="/" onClick={logout}>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Student Feedback</h1>
          <p className="text-muted-foreground mt-1">{mockFeedbackThreads.length} conversations</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 min-h-[500px]">
          {/* Thread List */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Inbox</p>
            </div>
            <div className="divide-y divide-border">
              {mockFeedbackThreads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedThread === thread.id ? "bg-primary/10" : "hover:bg-[hsl(220_30%_12%)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{getStudentName(thread.student_id)}</span>
                    {thread.is_resolved && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{thread.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{thread.course?.code}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Thread Detail */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
            {activeThread ? (
              <>
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{activeThread.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getStudentName(activeThread.student_id)} · {activeThread.course?.code}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeThread.messages?.map(msg => {
                    const isLecturer = msg.sender_id.startsWith("lec");
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isLecturer ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          isLecturer
                            ? "bg-primary/20 text-foreground rounded-br-md"
                            : "bg-[hsl(220_30%_15%)] text-foreground rounded-bl-md"
                        }`}>
                          <p>{msg.body}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {new Date(msg.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type a reply..."
                      className="flex-1 py-2.5 px-4 glass-input text-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturerFeedback;
