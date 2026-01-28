import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface RequireEmailVerifiedProps {
  children: ReactNode;
}

const RequireEmailVerified = ({ children }: RequireEmailVerifiedProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/admin/login");
      } else if (!user.email_confirmed_at) {
        navigate("/admin/verify-email");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  if (!user || !user.email_confirmed_at) {
    return null;
  }

  return <>{children}</>;
};

export default RequireEmailVerified;
