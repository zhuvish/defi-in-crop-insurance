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
        toWei(payoutEth || "0"),
        BigInt(rainfallThreshold || "0"),
        0n,
        0n,
        location,
      ],
      value: toWei(premiumEth || "0"),
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
        shadow-lg shadow-black/40
        rounded-2xl p-8
        hover:shadow-indigo-500/20
        transition
        space-y-6
      "
    >
      {/* TITLE INSIDE CARD */}
      <h1 className="text-3xl font-bold text-center text-white mb-4">
        Buy Insurance Policy
      </h1>

      <FormGroup
        label="Payout Amount (ETH)"
        value={payoutEth}
        setValue={setPayoutEth}
      />

      <FormGroup
        label="Rainfall Threshold (mm)"
        value={rainfallThreshold}
        setValue={setRainfallThreshold}
      />

      <FormGroup
        label="Location"
        value={location}
        setValue={setLocation}
      />

      <FormGroup
        label="Premium (ETH)"
        value={premiumEth}
        setValue={setPremiumEth}
      />

      <button
        type="submit"
        disabled={isPending}
        className="
          w-full py-3 rounded-xl
          bg-indigo-600 hover:bg-indigo-500 
          text-white font-semibold 
          shadow-[0_0_12px_rgba(88,101,242,0.5)]
          transition
          disabled:opacity-50
        "
      >
        {isPending ? "Submitting..." : "Buy Policy"}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-2">
          {(error as Error).message ?? "Transaction failed"}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-400 text-sm mt-2">
          Policy purchased! Check your policy dashboard.
        </p>
      )}
    </form>
  </div>
</div>
  );
}

function FormGroup({ label, value, setValue }: any) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="
          w-full px-3 py-2 
          bg-gray-900/70 
          border border-gray-700 
          rounded-lg 
          text-gray-100
          focus:border-indigo-500
          focus:ring-indigo-500
          outline-none
        "
      />
    </div>
  );
}