import type { Metadata } from "next";
import "./globals.css";
import ThirdwebAppProvider from "../components/ThirdwebAppProvider";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Decentralized Crop Insurance",
  description: "Parametric crop insurance on Sepolia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <ThirdwebAppProvider>
          <Navbar />
          <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-8">
            {children}
          </main>
        </ThirdwebAppProvider>
      </body>
    </html>
  );
}