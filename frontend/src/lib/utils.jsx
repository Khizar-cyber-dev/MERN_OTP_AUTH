import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/useAuth";


export const ProtectedRoute = ({ children }) => {
    const { user, authChecked } = useAuth();
    
    // only block routes while the initial auth check is in progress
    if (!authChecked) {
      return <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>;
    }
    
    if (!user) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };
  
export const PublicRoute = ({ children }) => {
    const { user, authChecked } = useAuth();
    
    // only block routes while the initial auth check is in progress
    if (!authChecked) {
      return <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>;
    }
    
    if (user) {
      return <Navigate to="/home" replace />;
    }
    
    return children;
  };