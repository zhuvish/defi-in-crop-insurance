"use client";

import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow mb-6">
      <div className="flex gap-4 text-sm">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/buy">Buy Policy</Link>
        <Link href="/policy">My Policy</Link>
        <Link href="/oracle">Oracle</Link>
        <Link href="/fund">Fund Pool</Link>
      </div>
      <ConnectWalletButton />
    </nav>
  );
}