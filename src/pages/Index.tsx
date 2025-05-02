
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && user) {
      navigate(user.role === "hr" ? "/hr/dashboard" : "/employee/dashboard", { replace: true });
    } else if (!isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-primary mb-4" />
          <p className="text-lg">Loading application...</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default Index;
