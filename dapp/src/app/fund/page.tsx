"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { contract } from "../../lib/contract";
import { toWei } from "thirdweb/utils";

export default function FundPoolPage() {
  const account = useActiveAccount();
  const [amount, setAmount] = useState("0.01");
  const { mutate: sendTx, isPending, error, isSuccess } = useSendTransaction();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tx = prepareContractCall({
      contract,
      method: "function fundPool() payable",
      params: [],
      value: toWei(amount || "0"),
    });

    sendTx(tx);
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
            transition space-y-6
          "
        >
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            💰 Add Funds
          </h1>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Amount (ETH)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
            {isPending ? "Processing..." : "Fund Pool"}
          </button>

          {error && (
            <p className="text-red-400 text-sm mt-2">
              {(error as Error).message}
            </p>
          )}
          {isSuccess && (
            <p className="text-green-400 text-sm mt-2">
              Funds added successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}