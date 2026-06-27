import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../@types/models";

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setActiveRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem("seapedia_user");
    const storedToken = localStorage.getItem("seapedia_token");
    const storedRole = localStorage.getItem("seapedia_active_role");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      if (storedRole) {
        setActiveRoleState(storedRole);
      }
    }
  }, []);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("seapedia_user", JSON.stringify(newUser));
    localStorage.setItem("seapedia_token", newToken);
    
    // Auto set active role if user only has one role
    if (newUser.roles.length === 1) {
      setActiveRole(newUser.roles[0]);
    } else {
      setActiveRoleState(null);
      localStorage.removeItem("seapedia_active_role");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setActiveRoleState(null);
    localStorage.removeItem("seapedia_user");
    localStorage.removeItem("seapedia_token");
    localStorage.removeItem("seapedia_active_role");
  };

  const setActiveRole = (role: string) => {
    setActiveRoleState(role);
    localStorage.setItem("seapedia_active_role", role);
  };

  return (
    <AuthContext.Provider value={{ user, token, activeRole, login, logout, setActiveRole }}>
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
