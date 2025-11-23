"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWalletButton from "./ConnectWalletButton";
import { useUserRole } from "../lib/useUserRole";

const baseLinks = [
  { href: "/", label: "Home", roles: ["FARMER", "INSURER"] },
];

const farmerLinks = [
  { href: "/buy", label: "Buy Policy" },
  { href: "/policy", label: "My Policy" },
];

const insurerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fund", label: "Fund Pool" },
  { href: "/oracle", label: "Oracle" },
];


export default function Navbar() {
  const pathname = usePathname();
  const { role, isLoading } = useUserRole();

  const isFarmer = role === "FARMER";
  const isInsurer = role === "INSURER";

  const links = [
    ...baseLinks,
    ...(isFarmer ? farmerLinks : []),
    ...(isInsurer ? insurerLinks : []),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Crop Insurance
          </span>

          <ul className="flex items-center gap-2 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={[
                      "rounded-full px-3 py-1 transition",
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {!isLoading && role !== "UNKNOWN" && (
            <span className="hidden text-xs text-slate-500 sm:inline">
              Role:{" "}
              <span className="font-medium text-slate-800">
                {role === "INSURER"
                  ? "Insurer"
                  : "Farmer"}
              </span>
            </span>
          )}
          <ConnectWalletButton />
        </div>
      </nav>
    </header>
  );
}
