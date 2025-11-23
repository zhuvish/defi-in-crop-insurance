export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 px-8 py-10 text-white shadow-lg">
        <h1 className="text-3xl font-semibold tracking-tight">
          Decentralized Crop Insurance
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-sky-100">
          Protect farmers from drought using parametric insurance on the Sepolia
          testnet. Payouts are triggered automatically based on rainfall data
          from the oracle.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1">
            • Parametric payouts
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            • On-chain transparency
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            • Powered by thirdweb
          </span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            For Farmers 👩‍🌾
          </h2>
          <p className="mt-2 text-xs text-slate-600">
            Buy a crop insurance policy, track your coverage, and receive
            instant payouts when rainfall drops below your threshold.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            For Insurers 🏦
          </h2>
          <p className="mt-2 text-xs text-slate-600">
            Fund the payout pool, monitor total exposure, and withdraw available
            profit transparently from the dashboard.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            For Oracles 🌧️
          </h2>
          <p className="mt-2 text-xs text-slate-600">
            Submit rainfall data for specific farmers to automatically trigger
            payouts according to the contract rules.
          </p>
        </div>
      </section>
    </div>
  );
}