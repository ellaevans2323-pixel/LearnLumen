/**
 * Freighter guard: throws if Freighter is not installed.
 * Wrap every wallet call with this.
 */
export async function requireFreighter(): Promise<void> {
  const { isConnected } = await import("@stellar/freighter-api");
  const connected = await isConnected();
  if (!connected) {
    throw new Error(
      "Freighter wallet not found. Please install the Freighter browser extension."
    );
  }
}

export async function getWalletAddress(): Promise<string> {
  await requireFreighter();
  const { getAddress } = await import("@stellar/freighter-api");
  const result = await getAddress();
  if (result.error) throw new Error(result.error);
  return result.address;
}
