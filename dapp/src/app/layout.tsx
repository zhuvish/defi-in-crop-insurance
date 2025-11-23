import type { Metadata } from "next";
import "./globals.css";
import ThirdwebAppProvider from "../components/ThirdwebAppProvider";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../context/ThemeContext";

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
      <body className="min-h-screen bg-white text-slate-900 dark:bg-[#0b1220] dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <ThirdwebAppProvider>
            <Navbar />
            <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-8">
              {children}
            </main>
          </ThirdwebAppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
