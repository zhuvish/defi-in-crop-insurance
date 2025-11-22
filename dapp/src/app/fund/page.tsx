"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { contract } from "../../lib/contract";
import { toWei } from "thirdweb/utils";

export default function FundPool() {
  const [amountEth, setAmountEth] = useState("0.01");
  const account = useActiveAccount();
  const { mutate: sendTx, isPending, error, isSuccess } = useSendTransaction();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Connect your wallet first.");
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method: "function fundPool() payable",
      params: [],
      value: toWei(amountEth || "0"),
    });

    sendTx(transaction);
  };

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Fund Payout Pool</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Amount (ETH)
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {isPending ? "Funding..." : "Fund Pool"}
        </button>

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {(error as Error).message ?? "Transaction failed"}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600 text-xs mt-2">
            Transaction sent! Check the Dashboard for updated values.
          </p>
        )}
      </form>
    </div>
  );
}