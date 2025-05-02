
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 sm:p-6">
      <div className="text-center glass-card p-10 max-w-lg w-full animate-fade-in">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-muted-foreground mb-6">
          The page you requested doesn't exist or you may not have the necessary permissions to view it.
        </p>
        <Link 
          to={user ? (user.role === "hr" ? "/hr/dashboard" : "/employee/dashboard") : "/login"} 
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg button-hover"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
