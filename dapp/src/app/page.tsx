export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Decentralized Crop Insurance</h1>
      <p>
        Use the navigation bar above to fund the pool, buy an insurance policy,
        view your policy, or trigger payouts as the oracle.
      </p>
      <p className="text-sm text-gray-600">
        Make sure MetaMask is connected to the <b>Sepolia</b> testnet.
      </p>
    </div>
  );
}