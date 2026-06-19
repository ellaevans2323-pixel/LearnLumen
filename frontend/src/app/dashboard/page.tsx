"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetRewards } from "@/lib/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface RewardEntry { id: string; points: number; createdAt: string }

export default function Dashboard() {
  const { token, walletAddress, login } = useAuth();
  const [total, setTotal] = useState<number | null>(null);
  const [rewards, setRewards] = useState<RewardEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !walletAddress) return;
    apiGetRewards(token, walletAddress)
      .then(({ total: t, rewards: r }) => {
        setTotal(t);
        setRewards(r as RewardEntry[]);
      })
      .catch((e: Error) => setError(e.message));
  }, [token, walletAddress]);

  if (!walletAddress) {
    return (
      <ErrorBoundary>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-600">Connect your Freighter wallet to view your dashboard.</p>
          <button onClick={login} className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">
            Connect Wallet
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8 font-mono">{walletAddress}</p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <p className="text-sm text-indigo-600 font-medium">Total Points</p>
          <p className="text-4xl font-bold text-indigo-900">{total ?? "—"}</p>
        </div>
        <h2 className="text-lg font-semibold mb-3">Reward History</h2>
        {rewards.length === 0 ? (
          <p className="text-gray-400 text-sm">No rewards yet.</p>
        ) : (
          <ul className="divide-y">
            {rewards.map((r) => (
              <li key={r.id} className="py-3 flex justify-between text-sm">
                <span className="text-gray-700">{new Date(r.createdAt).toLocaleDateString()}</span>
                <span className="font-medium text-indigo-700">+{r.points} pts</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ErrorBoundary>
  );
}
