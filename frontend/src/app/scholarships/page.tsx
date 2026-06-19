"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetScholarships, apiCreateFund } from "@/lib/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface Fund {
  id: string;
  donor: string;
  amountXlm: number;
  remaining: number;
  createdAt: string;
}

export default function ScholarshipsPage() {
  const { token, walletAddress, login } = useAuth();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGetScholarships().then(setFunds).catch((e: Error) => setError(e.message));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { setError("Connect wallet first."); return; }
    setLoading(true);
    setError("");
    try {
      const fund = await apiCreateFund(token, Number(amount));
      setFunds([fund, ...funds]);
      setAmount("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Scholarship Funds</h1>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
        {walletAddress ? (
          <form onSubmit={handleCreate} className="flex gap-3 mb-8">
            <input
              type="number"
              min="1"
              required
              placeholder="Amount in XLM"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Creating…" : "Create Fund"}
            </button>
          </form>
        ) : (
          <button onClick={login} className="mb-8 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">
            Connect Wallet to Donate
          </button>
        )}
        <div className="flex flex-col gap-4">
          {funds.map((f) => (
            <div key={f.id} className="border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-mono text-xs text-gray-500 truncate max-w-[60%]">{f.donor}</p>
                <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-bold">{f.amountXlm} XLM</p>
                </div>
                <div>
                  <p className="text-gray-500">Remaining</p>
                  <p className="font-bold text-indigo-700">{f.remaining} XLM</p>
                </div>
              </div>
            </div>
          ))}
          {funds.length === 0 && <p className="text-gray-400 text-sm">No funds yet.</p>}
        </div>
      </div>
    </ErrorBoundary>
  );
}
