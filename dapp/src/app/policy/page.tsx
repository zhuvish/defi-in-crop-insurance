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
    return <p>Please connect your wallet to view your policy.</p>;
  }

  if (isLoading || !data) {
    return <p>Loading policy…</p>;
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
  ] = data as [
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
    return <p>You do not have a policy yet.</p>;
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-2">My Policy</h1>
      <div className="space-y-2 p-4 bg-white rounded-lg shadow">
        <p>
          <span className="font-semibold">Farmer:</span>{" "}
          <span className="font-mono break-all">{farmer}</span>
        </p>
        <p>
          <span className="font-semibold">Premium Paid:</span>{" "}
          {toEth(premiumPaid)} ETH
        </p>
        <p>
          <span className="font-semibold">Payout Amount:</span>{" "}
          {toEth(payoutAmount)} ETH
        </p>
        <p>
          <span className="font-semibold">Rainfall Threshold:</span>{" "}
          {rainfallThreshold.toString()} mm
        </p>
        <p>
          <span className="font-semibold">Location:</span> {location}
        </p>
        <p>
          <span className="font-semibold">Active:</span>{" "}
          {active ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-semibold">Paid Out:</span>{" "}
          {paidOut ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}