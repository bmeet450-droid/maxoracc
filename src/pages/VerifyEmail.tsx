import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Check if email is already verified
    if (user?.email_confirmed_at) {
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Listen for auth state changes (when user clicks verification link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' && session?.user?.email_confirmed_at) {
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified.",
        });
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    // Cooldown timer
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (!user?.email || cooldown > 0) return;

    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: "Unable to resend verification email. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email sent!",
        description: "Check your inbox for the verification link.",
      });
      setCooldown(60); // 60 second cooldown
    }

    setIsResending(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000000' }}>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  // If email is already verified, show success and redirect
  if (user?.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000000' }}>
        <div 
          className="w-full max-w-md p-8 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(34, 197, 94, 0.1)' }}
          >
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
          <p className="text-white/50 text-sm">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000000' }}>
      <div 
        className="w-full max-w-md p-8 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Mail size={28} className="text-white/60" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-white/50 text-sm">
            We've sent a verification link to
          </p>
          <p className="text-white font-medium mt-1">{user?.email}</p>
        </div>

        <div 
          className="p-4 rounded-xl mb-6"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-white/60 text-sm text-center">
            Please check your inbox and click the verification link to continue. 
            Don't forget to check your spam folder.
          </p>
        </div>

        <button
          onClick={handleResendEmail}
          disabled={isResending || cooldown > 0}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <RefreshCw size={16} className={`text-white/90 ${isResending ? 'animate-spin' : ''}`} />
          <span className="text-white/90">
            {cooldown > 0 
              ? `Resend in ${cooldown}s` 
              : isResending 
                ? 'Sending...' 
                : 'Resend Verification Email'
            }
          </span>
        </button>

        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span className="text-white/70">Sign in with a different account</span>
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
