"use client";

import { useReadContract } from "thirdweb/react";
import { contract } from "../../lib/contract";
import { formatUnits } from "viem";

const toEth = (value?: bigint) =>
  value !== undefined ? Number(formatUnits(value, 18)).toFixed(4) : "...";

export default function Dashboard() {
  const { data: insurer } = useReadContract({
    contract,
    method: "function insurer() view returns (address)",
    params: [],
  });

  const { data: oracle } = useReadContract({
    contract,
    method: "function oracle() view returns (address)",
    params: [],
  });

  const { data: reservedFunds } = useReadContract({
    contract,
    method: "function reservedFunds() view returns (uint256)",
    params: [],
  });

  const { data: availableProfit } = useReadContract({
    contract,
    method: "function availableProfit() view returns (uint256)",
    params: [],
  });

  const { data: totalPolicies } = useReadContract({
    contract,
    method: "function totalPolicies() view returns (uint256)",
    params: [],
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-2">Contract Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-xs text-gray-500">Insurer</p>
          <p className="font-mono break-all text-sm">{insurer ?? "…"}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-xs text-gray-500">Oracle</p>
          <p className="font-mono break-all text-sm">{oracle ?? "…"}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-xs text-gray-500">Reserved Funds</p>
          <p>{toEth(reservedFunds as bigint)} ETH</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-xs text-gray-500">Available Profit</p>
          <p>{toEth(availableProfit as bigint)} ETH</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-xs text-gray-500">Total Policies</p>
          <p>{totalPolicies?.toString() ?? "…"}</p>
        </div>
      </div>
    </div>
  );
}