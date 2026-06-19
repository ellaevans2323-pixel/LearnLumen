const API = process.env.NEXT_PUBLIC_API_URL ?? "";

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function apiLogin(walletAddress: string, role?: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, role }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ token: string; user: { role: string } }>;
}

export async function apiGetCredential(id: string) {
  const res = await fetch(`${API}/credentials/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiVerifyCredential(hash: string) {
  const res = await fetch(`${API}/credentials/verify/${hash}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ valid: boolean; credential: unknown }>;
}

export async function apiIssueCredential(
  token: string,
  data: { studentAddress: string; institution: string; course: string }
) {
  const res = await fetch(`${API}/credentials/issue`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGetRewards(token: string, walletAddress: string) {
  const res = await fetch(`${API}/rewards/${walletAddress}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ total: number; rewards: unknown[] }>;
}

export async function apiGetScholarships() {
  const res = await fetch(`${API}/scholarships`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiCreateFund(token: string, amountXlm: number) {
  const res = await fetch(`${API}/scholarships/fund`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ amountXlm }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDisburse(
  token: string,
  fundId: string,
  data: { student: string; amount: number; txHash: string }
) {
  const res = await fetch(`${API}/scholarships/${fundId}/disburse`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
