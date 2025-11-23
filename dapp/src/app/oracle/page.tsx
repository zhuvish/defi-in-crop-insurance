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
      method: "function triggerPayout(address farmerAddr, uint256 rainfall)",
      params: [farmerAddress, BigInt(rainfall || "0")],
    });

    sendTx(transaction);
  };

  return (
    <div className="px-6 lg:px-20 py-12 flex justify-center text-gray-100">
      <div className="w-full max-w-md">

        <form
          onSubmit={onSubmit}
          className="
            bg-gray-800/70 
            backdrop-blur-xl 
            border border-gray-700 
            rounded-2xl 
            p-8 
            shadow-lg shadow-black/40
            hover:shadow-indigo-500/20
            transition
            space-y-6
          "
        >
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Oracle: Trigger Payout
          </h1>

          <h2 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
            🌧 Submit Rainfall Data
          </h2>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Farmer Address
            </label>
            <input
              value={farmerAddress}
              onChange={(e) => setFarmerAddress(e.target.value)}
              className="
                w-full px-3 py-2 
                bg-gray-900/70 
                border border-gray-700 
                rounded-lg 
                font-mono 
                text-gray-100
                focus:border-indigo-500
                outline-none
              "
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Rainfall (mm)
            </label>
            <input
              type="number"
              min="0"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="
                w-full px-3 py-2 
                bg-gray-900/70 
                border border-gray-700 
                rounded-lg 
                text-gray-100
                focus:border-indigo-500
                outline-none
              "
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="
              w-full py-3 rounded-xl
              bg-indigo-600 hover:bg-indigo-500 
              text-white font-semibold 
              shadow-[0_0_12px_rgba(88,101,242,0.5)]
              transition
            "
          >
            {isPending ? "Sending..." : "Trigger Payout"}
          </button>

          {error && (
            <p className="text-red-400 text-sm mt-2">
              {(error as Error).message ?? "Transaction failed"}
            </p>
          )}
          {isSuccess && (
            <p className="text-green-400 text-sm mt-2">
              Rainfall submitted! Payout triggered if conditions met.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}