import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Nav } from "@/components/Nav";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "LearnLumen",
  description: "Blockchain-powered education platform on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          <ErrorBoundary>
            <main>{children}</main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
