"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { contract } from "../../lib/contract";
import { toWei } from "thirdweb/utils";

export default function BuyPolicy() {
  const account = useActiveAccount();

  const [payoutEth, setPayoutEth] = useState("0.005");
  const [rainfallThreshold, setRainfallThreshold] = useState("50");
  const [location, setLocation] = useState("Delhi");
  const [premiumEth, setPremiumEth] = useState("0.002");

  const { mutate: sendTx, isPending, error, isSuccess } = useSendTransaction();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      alert("Connect your wallet first.");
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method:
        "function buyPolicy(uint256 _payoutAmount, uint256 _rainfallThreshold, uint256 _startAt, uint256 _endAt, string _location) payable",
      params: [
        toWei(payoutEth || "0"), // _payoutAmount
        BigInt(rainfallThreshold || "0"), // _rainfallThreshold
        0n, // _startAt
        0n, // _endAt
        location, // _location
      ],
      value: toWei(premiumEth || "0"), // msg.value = premium
    });

    sendTx(transaction);
  };

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Buy Insurance Policy</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Payout Amount (ETH)
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={payoutEth}
            onChange={(e) => setPayoutEth(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rainfall Threshold (mm)
          </label>
          <input
            type="number"
            min="0"
            value={rainfallThreshold}
            onChange={(e) => setRainfallThreshold(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Premium (ETH)
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={premiumEth}
            onChange={(e) => setPremiumEth(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Buy Policy"}
        </button>

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {(error as Error).message ?? "Transaction failed"}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600 text-xs mt-2">
            Policy transaction sent! Wait for confirmation on Sepolia.
          </p>
        )}
      </form>
    </div>
  );
}