import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Profile, UserRole } from "@/types/database";
import { mockStudentProfile, mockLecturerProfile, mockAdminProfile } from "@/lib/mock-data";

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const profileByRole: Record<UserRole, Profile> = {
  student: mockStudentProfile,
  lecturer: mockLecturerProfile,
  admin: mockAdminProfile,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);

  const login = useCallback((_email: string, _password: string, role: UserRole) => {
    setUser(profileByRole[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser(profileByRole[role]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
