"use client";

import { motion } from "framer-motion";
import { CloudRain, Wallet, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="px-6 lg:px-20 py-10 text-gray-100">
      
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          rounded-3xl 
          bg-gray-800/70 
          backdrop-blur-xl 
          shadow-xl 
          shadow-black/40 
          border border-gray-700 
          p-12 mt-10
        "
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Decentralized Crop Insurance
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl">
          Protect farmers from drought using parametric insurance on the{" "}
          <span className="font-semibold text-indigo-400">Sepolia testnet</span>.
          Payouts are triggered automatically based on rainfall data from the oracle.
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-3 mt-6">
          {["Parametric payouts", "On-chain transparency", "Powered by thirdweb"].map((tag, index) => (
            <span
              key={index}
              className="
                px-4 py-1.5 
                bg-indigo-600/20 
                text-indigo-300 
                rounded-full 
                text-sm 
                border border-indigo-700/40
              "
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* FEATURE CARDS */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        
        <FeatureCard
          icon={<Wallet className="w-8 h-8 text-indigo-400" />}
          title="For Farmers"
          description="Buy coverage, track your policies, and receive instant payouts when rainfall drops below your threshold."
        />

        <FeatureCard
          icon={<BarChart3 className="w-8 h-8 text-indigo-400" />}
          title="For Insurers"
          description="Fund the pool, monitor total exposure, and withdraw profits transparently through the dashboard."
        />

        <FeatureCard
          icon={<CloudRain className="w-8 h-8 text-indigo-400" />}
          title="For Oracles"
          description="Submit rainfall data to automatically trigger payouts based on smart contract rules."
        />

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="
        bg-gray-800/70 
        backdrop-blur-xl 
        border border-gray-700 
        shadow-lg shadow-black/30 
        rounded-2xl p-7 
        transition-all
      "
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">
        {description}
      </p>
    </motion.div>
  );
}