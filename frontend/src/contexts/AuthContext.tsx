"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getWalletAddress } from "@/lib/freighter";
import { apiLogin } from "@/lib/api";

interface AuthState {
  token: string | null;
  walletAddress: string | null;
  role: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ll_token");
    const savedAddr = localStorage.getItem("ll_wallet");
    const savedRole = localStorage.getItem("ll_role");
    if (saved && savedAddr) {
      setToken(saved);
      setWalletAddress(savedAddr);
      setRole(savedRole);
    }
  }, []);

  async function login() {
    const addr = await getWalletAddress();
    const { token: t, user } = await apiLogin(addr);
    setToken(t);
    setWalletAddress(addr);
    setRole(user.role);
    localStorage.setItem("ll_token", t);
    localStorage.setItem("ll_wallet", addr);
    localStorage.setItem("ll_role", user.role);
  }

  function logout() {
    setToken(null);
    setWalletAddress(null);
    setRole(null);
    localStorage.removeItem("ll_token");
    localStorage.removeItem("ll_wallet");
    localStorage.removeItem("ll_role");
  }

  return (
    <AuthContext.Provider value={{ token, walletAddress, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
