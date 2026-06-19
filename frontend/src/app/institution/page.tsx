"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiIssueCredential } from "@/lib/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function InstitutionPage() {
  const { token, walletAddress, login } = useAuth();
  const [form, setForm] = useState({ studentAddress: "", institution: "", course: "" });
  const [result, setResult] = useState<{ id: string; hash: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { setError("Please connect your wallet first."); return; }
    setLoading(true);
    setError("");
    try {
      const cred = await apiIssueCredential(token, form);
      setResult(cred);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!walletAddress) {
    return (
      <ErrorBoundary>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-600">Connect your wallet to issue credentials.</p>
          <button onClick={login} className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">
            Connect Wallet
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Issue Credential</h1>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm">
            <p className="font-semibold text-green-700">Credential issued!</p>
            <p className="font-mono text-xs mt-1 break-all">Hash: {result.hash}</p>
            <p className="font-mono text-xs mt-1">ID: {result.id}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {(["studentAddress", "institution", "course"] as const).map((field) => (
            <input
              key={field}
              required
              placeholder={field === "studentAddress" ? "Student wallet address" : field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          ))}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Issuing…" : "Issue Credential"}
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
}
