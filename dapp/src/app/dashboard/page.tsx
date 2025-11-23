"use client";

import { useReadContract } from "thirdweb/react";
import { contract } from "../../lib/contract";
import { formatUnits } from "viem";
import { User, CloudRain, Wallet, FileText } from "lucide-react";

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
    <div className="px-6 lg:px-20 py-12 flex justify-center text-gray-100">

      {/* Outer Big Card */}
      <div
        className="
          w-full max-w-6xl
          bg-gray-800/70 
          backdrop-blur-xl
          border border-gray-700
          rounded-3xl 
          p-10 
          shadow-xl shadow-black/40
          hover:shadow-indigo-500/20
          transition
        "
      >
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Contract Dashboard
        </h1>

        {/* Inner Cards Grid */}
        <div
          className="
            grid grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-8 
            justify-items-center
          "
        >
          <InfoCard
            icon={<User className="w-7 h-7 text-indigo-400" />}
            label="Insurer"
            value={insurer ?? "..."}
          />

          <InfoCard
            icon={<CloudRain className="w-7 h-7 text-indigo-400" />}
            label="Oracle"
            value={oracle ?? "..."}
          />

          <InfoCard
            icon={<Wallet className="w-7 h-7 text-indigo-400" />}
            label="Reserved Funds"
            value={`${toEth(reservedFunds as bigint)} ETH`}
          />

          <InfoCard
            icon={<Wallet className="w-7 h-7 text-indigo-400" />}
            label="Available Profit"
            value={`${toEth(availableProfit as bigint)} ETH`}
          />

          <InfoCard
            icon={<FileText className="w-7 h-7 text-indigo-400" />}
            label="Total Policies"
            value={totalPolicies?.toString() ?? "..."}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: any) {
  return (
    <div
      className="
        w-full
        bg-gray-900/60
        border border-gray-700
        rounded-2xl 
        p-6 
        shadow-lg shadow-black/40
        hover:shadow-indigo-500/20 
        transition-all
      "
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>

      <p className="font-mono text-gray-100 text-lg break-all">
        {value}
      </p>
    </div>
  );
}