"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function Nav() {
  const { walletAddress, login, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-indigo-900 text-white">
      <Link href="/" className="font-bold text-lg">LearnLumen</Link>
      <div className="flex gap-5 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/institution">Institution</Link>
        <Link href="/scholarships">Scholarships</Link>
      </div>
      <div>
        {walletAddress ? (
          <button onClick={logout} className="text-xs bg-indigo-700 px-3 py-1 rounded hover:bg-indigo-600">
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)} · Logout
          </button>
        ) : (
          <button onClick={login} className="text-xs bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-400">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
