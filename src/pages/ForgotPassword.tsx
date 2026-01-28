import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Check your email",
      description: "We've sent you a password reset link.",
    });
    setIsLoading(false);
  };

  const inputClassName = `
    w-full px-4 py-3 pl-12 rounded-xl text-white/90 text-sm
    transition-all duration-500
    placeholder:text-white/30
    focus:outline-none
  `;

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000000' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/login')}
        className="fixed top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <ArrowLeft size={16} className="text-white/60 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-white/70">Back to Login</span>
      </button>

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
            <KeyRound size={28} className="text-white/60" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-white/50 text-sm">
            {isSubmitted 
              ? "Check your email for the reset link"
              : "Enter your email to receive a reset link"
            }
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-6">
            <div 
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Mail size={32} className="mx-auto mb-3 text-white/40" />
              <p className="text-white/70 text-sm">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <p className="text-white/40 text-xs mt-2">
                Didn't receive it? Check your spam folder or try again.
              </p>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-white/70">Try a different email</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClassName}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span className="text-white/90">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </span>
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-white/40 text-sm">
          Remember your password?{' '}
          <Link 
            to="/admin/login" 
            className="text-white/70 hover:text-white transition-colors underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
