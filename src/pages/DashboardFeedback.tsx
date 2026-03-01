import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Send, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { mockFeedbackThreads } from "@/lib/mock-data";
import type { FeedbackThread } from "@/types/database";

const isLecturerMsg = (senderId: string) => senderId.startsWith("lec");

const DashboardFeedback = () => {
  const { user } = useAuth();
  const [selectedThread, setSelectedThread] = useState<FeedbackThread | null>(null);
  const [reply, setReply] = useState("");

  // Filter threads for this student
  const threads = mockFeedbackThreads;

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
  };

  return (
    <div className="min-h-screen bg-navy dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-navy/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-4 h-14 px-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-foreground">Feedback</h1>
            <p className="text-xs text-muted-foreground">Conversations with lecturers</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 max-w-4xl">
        {!selectedThread ? (
          /* Thread List */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {threads.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="text-foreground font-semibold mb-1">No conversations yet</h3>
                <p className="text-sm text-muted-foreground">When a lecturer sends you feedback, it will appear here.</p>
              </div>
            )}
            {threads.map((thread, i) => {
              const lastMsg = thread.messages?.[thread.messages.length - 1];
              const isUnread = lastMsg && isLecturerMsg(lastMsg.sender_id);
              return (
                <motion.button
                  key={thread.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isUnread
                      ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                      : "border-border bg-card hover:bg-[hsl(220_30%_12%)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {isUnread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        <h3 className="text-sm font-semibold text-foreground truncate">{thread.subject}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {lastMsg ? lastMsg.body.slice(0, 80) + (lastMsg.body.length > 80 ? "…" : "") : "No messages"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      {lastMsg ? formatTime(lastMsg.created_at) : ""}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          /* Chat View */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => setSelectedThread(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> All Threads
            </button>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Thread header */}
              <div className="p-4 border-b border-border bg-[hsl(220_30%_10%)]">
                <h3 className="text-sm font-semibold text-foreground">{selectedThread.subject}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Course thread · {selectedThread.messages?.length || 0} messages
                </p>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
                {selectedThread.messages?.map((msg, i) => {
                  const isMe = !isLecturerMsg(msg.sender_id);
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isMe
                          ? "bg-primary/20 text-foreground border border-primary/20"
                          : "bg-[hsl(220_30%_12%)] text-foreground border border-border"
                      }`}>
                        <p className="text-xs font-semibold mb-1">
                          {isMe ? "You" : "Lecturer"}
                        </p>
                        <p className="text-sm leading-relaxed">{msg.body}</p>
                        <p className={`text-[10px] mt-2 ${isMe ? "text-primary/70" : "text-muted-foreground"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type a reply…"
                  className="bg-[hsl(220_30%_10%)] border-border text-foreground placeholder:text-muted-foreground"
                  onKeyDown={e => {
                    if (e.key === "Enter" && reply.trim()) setReply("");
                  }}
                />
                <Button
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                  onClick={() => reply.trim() && setReply("")}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardFeedback;
