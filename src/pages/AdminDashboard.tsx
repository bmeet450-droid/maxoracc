import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Mail, Calendar, User, MessageSquare, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  email_sent: boolean;
  confirmation_sent: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-contact-submissions');
      
      if (error) throw error;
      
      setSubmissions(data.submissions || []);
    } catch (error: unknown) {
      // Log for debugging but don't expose internal details to user
      toast({
        title: "Error loading submissions",
        description: "Unable to load submissions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ArrowLeft size={16} className="text-white/60 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-white/70">Back to Site</span>
          </button>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm hidden sm:block">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <LogOut size={16} className="text-white/60" />
            <span className="text-white/70">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div 
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-white/50 text-sm mb-1">Total Submissions</div>
              <div className="text-3xl font-bold text-white">{submissions.length}</div>
            </div>
            <div 
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-white/50 text-sm mb-1">Emails Sent</div>
              <div className="text-3xl font-bold text-white">
                {submissions.filter(s => s.email_sent).length}
              </div>
            </div>
            <div 
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-white/50 text-sm mb-1">Confirmations Sent</div>
              <div className="text-3xl font-bold text-white">
                {submissions.filter(s => s.confirmation_sent).length}
              </div>
            </div>
          </div>

          {/* Header with refresh */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Contact Submissions</h2>
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <RefreshCw size={14} className={`text-white/60 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-white/70">Refresh</span>
            </button>
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="text-center py-12 text-white/50">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div 
              className="text-center py-12 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <MessageSquare size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/50">No submissions yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
                  className="p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: selectedSubmission?.id === submission.id 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <User size={16} className="text-white/40 flex-shrink-0" />
                        <span className="text-white font-medium truncate">{submission.name}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Mail size={16} className="text-white/40 flex-shrink-0" />
                        <a 
                          href={`mailto:${submission.email}`} 
                          className="text-white/60 text-sm hover:text-white transition-colors truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {submission.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-white/40 flex-shrink-0" />
                        <span className="text-white/40 text-sm">{formatDate(submission.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {submission.email_sent && (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                          Notified
                        </span>
                      )}
                      {submission.confirmation_sent && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                          Confirmed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Message */}
                  {selectedSubmission?.id === submission.id && (
                    <div 
                      className="mt-4 pt-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="text-white/40 text-xs uppercase tracking-wide mb-2">Message</div>
                      <p className="text-white/80 text-sm whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
