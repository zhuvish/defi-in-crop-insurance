"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { contract } from "../../lib/contract";

export default function OraclePage() {
  const [farmerAddress, setFarmerAddress] = useState("");
  const [rainfall, setRainfall] = useState("20");
  const account = useActiveAccount();
  const { mutate: sendTx, isPending, error, isSuccess } = useSendTransaction();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Connect wallet (must be oracle or insurer).");
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method:
        "function triggerPayout(address farmerAddr, uint256 rainfall)",
      params: [farmerAddress, BigInt(rainfall || "0")],
    });

    sendTx(transaction);
  };

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Oracle: Trigger Payout</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Farmer Address
          </label>
          <input
            value={farmerAddress}
            onChange={(e) => setFarmerAddress(e.target.value)}
            className="w-full border rounded px-3 py-2 font-mono"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rainfall (mm)
          </label>
          <input
            type="number"
            min="0"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Trigger Payout"}
        </button>

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {(error as Error).message ?? "Transaction failed"}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600 text-xs mt-2">
            Transaction sent! Check events and farmer wallet.
          </p>
        )}
      </form>
    </div>
  );
}