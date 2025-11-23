"use client";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../../lib/contract";
import { formatUnits } from "viem";

export default function MyPolicy() {
  const account = useActiveAccount();

  const { data, isLoading } = useReadContract({
    contract,
    method:
      "function getPolicyFor(address farmerAddr) view returns (address _farmer, uint256 _premiumPaid, uint256 _payoutAmount, uint256 _rainfallThreshold, uint256 _startAt, uint256 _endAt, string _location, bool _active, bool _paidOut)",
    params: [
      account?.address ??
        "0x0000000000000000000000000000000000000000",
    ],
  });

  if (!account) {
    return (
      <p className="text-center text-gray-300 mt-10">
        Connect your wallet to view your policy.
      </p>
    );
  }

  if (isLoading || !data) {
    return (
      <p className="text-center text-gray-300 mt-10">
        Loading your policy…
      </p>
    );
  }

  const [
    farmer,
    premiumPaid,
    payoutAmount,
    rainfallThreshold,
    startAt,
    endAt,
    location,
    active,
    paidOut,
  ] = data as unknown as [
    string,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    string,
    boolean,
    boolean
  ];

  const toEth = (v: bigint) => Number(formatUnits(v, 18)).toFixed(4);

  const noPolicy =
    farmer === "0x0000000000000000000000000000000000000000" &&
    premiumPaid === 0n &&
    payoutAmount === 0n &&
    !active &&
    !paidOut;

  if (noPolicy) {
    return (
      <p className="text-center text-gray-300 mt-10">
        You do not have a policy yet.
      </p>
    );
  }

  return (
    <div className="px-6 lg:px-20 py-12 flex justify-center text-gray-100">
      <div className="w-full max-w-xl mx-auto space-y-8">

        {/* TITLE INSIDE CARD */}
        <div
          className="
            space-y-6 
            p-8 
            rounded-2xl
            bg-[#111827]/60
            bg-gradient-to-br from-[#1f2937]/70 to-[#111827]/60
            backdrop-blur-xl
            border border-gray-700/40
            shadow-[0_8px_30px_rgba(0,0,0,0.45)]
            transition-all duration-300
            text-gray-100
          "
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            My Policy
          </h1>

          <PolicyItem label="Farmer" value={farmer} mono />
          <PolicyItem label="Premium Paid" value={`${toEth(premiumPaid)} ETH`} />
          <PolicyItem label="Payout Amount" value={`${toEth(payoutAmount)} ETH`} />
          <PolicyItem label="Rainfall Threshold" value={`${rainfallThreshold} mm`} />
          <PolicyItem label="Location" value={location} />
          <PolicyItem label="Active" value={active ? "Yes" : "No"} />
          <PolicyItem label="Paid Out" value={paidOut ? "Yes" : "No"} />
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ label, value, mono = false }: any) {
  return (
    <p className="text-gray-200 text-lg">
      <span className="font-semibold text-indigo-300">{label}:</span>{" "}
      <span className={mono ? "font-mono break-all" : ""}>{value}</span>
    </p>
  );
}