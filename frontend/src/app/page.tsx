import Link from "next/link";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-extrabold mb-6">LearnLumen</h1>
          <p className="text-xl text-indigo-200 mb-10">
            Verifiable academic credentials, XLM student rewards, and borderless
            scholarship payments — all on Stellar.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-100">
              Student Portal
            </Link>
            <Link href="/institution" className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Issue Credentials
            </Link>
            <Link href="/scholarships" className="bg-indigo-500 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-400">
              Scholarships
            </Link>
          </div>
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {[
              { title: "Verifiable Credentials", body: "sha256-hashed course completions stored on Soroban." },
              { title: "XLM Rewards", body: "Earn points for learning milestones, redeem as XLM." },
              { title: "Scholarship Funds", body: "Donors create on-chain funds; disbursements are trustless." },
            ].map((f) => (
              <div key={f.title} className="bg-indigo-900/60 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-indigo-300 text-sm">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
