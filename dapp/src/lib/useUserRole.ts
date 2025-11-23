"use client";

import { useMemo } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "./contract";

export type UserRole = "INSURER" | "FARMER" | "UNKNOWN";

export function useUserRole(): { role: UserRole; isLoading: boolean } {
  const account = useActiveAccount();

  const { data: insurerAddress, isLoading: loadingInsurer } = useReadContract({
    contract,
    method: "function insurer() view returns (address)",
    params: [],
  });

  const isLoading = loadingInsurer;

  const role: UserRole = useMemo(() => {
    if (!account?.address || !insurerAddress) {
      return "UNKNOWN";
    }

    const me = account.address.toLowerCase();
    const insurer = String(insurerAddress).toLowerCase();

    if (me === insurer) return "INSURER";
    return "FARMER";
  }, [account?.address, insurerAddress]);

  return { role, isLoading };
}