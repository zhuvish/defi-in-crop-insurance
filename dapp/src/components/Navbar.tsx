"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWalletButton from "./ConnectWalletButton";
import { useUserRole } from "../lib/useUserRole";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

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
  const { theme, toggleTheme } = useTheme();

  const isFarmer = role === "FARMER";
  const isInsurer = role === "INSURER";

  const links = [
    ...baseLinks,
    ...(isFarmer ? farmerLinks : []),
    ...(isInsurer ? insurerLinks : []),
  ];

  return (
    <header
      className="
        sticky top-0 z-30 
        backdrop-blur-xl 
        bg-gradient-to-b from-[#0A0F1F]/95 to-[#0D1330]/80
        border-b border-indigo-500/20
        shadow-[0_0_25px_rgba(88,101,242,0.45)]
        rounded-b-2xl
        transition-all duration-300
      "
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        {/* BRAND */}
        <span className="text-lg font-bold text-indigo-300 tracking-tight drop-shadow-[0_0_6px_rgba(88,101,242,0.6)]">
          Crop Insurance
        </span>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-3 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg transition 
                    border 
                    ${
                      active
                        ? `
                          bg-indigo-600 
                          text-white 
                          border-indigo-400/60
                          shadow-[0_0_18px_rgba(88,101,242,0.5)]
                        `
                        : `
                          text-indigo-200 
                          border-transparent
                          hover:text-white 
                          hover:bg-indigo-600/20
                          hover:shadow-[0_0_12px_rgba(88,101,242,0.4)]
                        `
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* THEME TOGGLE + ROLE + WALLET */}
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="
              p-2 rounded-full 
              border border-indigo-400/40 
              bg-[#0d1324]/70
              hover:bg-indigo-600/20
              hover:shadow-[0_0_12px_rgba(88,101,242,0.5)]
              transition-all duration-300
            "
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-indigo-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {/* ROLE */}
          {!isLoading && role !== "UNKNOWN" && (
            <span className="hidden sm:inline text-xs text-indigo-300">
              Role:{" "}
              <span className="font-semibold text-indigo-400">
                {role === "INSURER" ? "Insurer" : "Farmer"}
              </span>
            </span>
          )}

          {/* WALLET BUTTON */}
          <ConnectWalletButton />
        </div>
      </nav>
    </header>
  );
}