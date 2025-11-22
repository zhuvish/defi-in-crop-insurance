"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      client={client}
      theme="dark"
      connectModal={{ size: "compact" }}
    />
  );
}