import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import ThirdwebAppProvider from "../components/ThirdwebAppProvider";

const metadata: Metadata = {
  title: "Crop Insurance DApp",
  description: "Decentralized crop insurance on Sepolia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <ThirdwebAppProvider>
          <Navbar />
          <main className="p-6 max-w-4xl mx-auto">{children}</main>
        </ThirdwebAppProvider>
      </body>
    </html>
  );
}