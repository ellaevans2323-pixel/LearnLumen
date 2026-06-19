"use client";
import { useEffect, useState } from "react";
import { apiVerifyCredential } from "@/lib/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface Credential {
  id: string;
  hash: string;
  institution: string;
  studentAddr: string;
  issuedAt: string;
  revokedAt: string | null;
}

export default function VerifyPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<{ valid: boolean; credential: Credential } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiVerifyCredential(params.id)
      .then((r) => setResult(r as { valid: boolean; credential: Credential }))
      .catch((e: Error) => setError(e.message));
  }, [params.id]);

  return (
    <ErrorBoundary>
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Verify Credential</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className={`border rounded-xl p-6 ${result.valid ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-2xl`}>{result.valid ? "✅" : "❌"}</span>
              <p className={`font-bold text-lg ${result.valid ? "text-green-700" : "text-red-700"}`}>
                {result.valid ? "Valid Credential" : "Revoked Credential"}
              </p>
            </div>
            <dl className="text-sm grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
              <dt className="text-gray-500 font-medium">Institution</dt>
              <dd className="font-mono">{result.credential.institution}</dd>
              <dt className="text-gray-500 font-medium">Student</dt>
              <dd className="font-mono text-xs break-all">{result.credential.studentAddr}</dd>
              <dt className="text-gray-500 font-medium">Issued</dt>
              <dd>{new Date(result.credential.issuedAt).toLocaleString()}</dd>
              {result.credential.revokedAt && (
                <>
                  <dt className="text-gray-500 font-medium">Revoked</dt>
                  <dd className="text-red-600">{new Date(result.credential.revokedAt).toLocaleString()}</dd>
                </>
              )}
              <dt className="text-gray-500 font-medium">Hash</dt>
              <dd className="font-mono text-xs break-all">{result.credential.hash}</dd>
            </dl>
          </div>
        )}
        {!result && !error && (
          <p className="text-gray-400 text-sm">Looking up credential…</p>
        )}
      </div>
    </ErrorBoundary>
  );
}
