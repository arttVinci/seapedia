import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../@types/models";
import { authService } from "../services";

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: string | null;
  handleLoginSuccess: (token: string) => void;
  handleLogout: () => void;
  handleSelectRoleSuccess: (token: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem("seapedia_token");
    const storedRole = localStorage.getItem("seapedia_active_role");

    if (storedToken && !isInitialized) {
      setToken(storedToken);
      if (storedRole) {
        setActiveRoleState(storedRole);
      }
      
      // Fetch user data with stored token
      authService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // If token invalid, clear storage
          handleLogout();
        })
        .finally(() => {
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("seapedia_token", newToken);
    
    // Clear active role on login (requires user to select again)
    setActiveRoleState(null);
    localStorage.removeItem("seapedia_active_role");

    // Fetch user profile immediately
    authService.getCurrentUser().then(userData => {
      setUser(userData);
    }).catch(console.error);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setActiveRoleState(null);
    localStorage.removeItem("seapedia_token");
    localStorage.removeItem("seapedia_active_role");
  };

  const handleSelectRoleSuccess = (newToken: string, role: string) => {
    setToken(newToken);
    setActiveRoleState(role);
    localStorage.setItem("seapedia_token", newToken);
    localStorage.setItem("seapedia_active_role", role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      activeRole, 
      handleLoginSuccess, 
      handleLogout, 
      handleSelectRoleSuccess 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
