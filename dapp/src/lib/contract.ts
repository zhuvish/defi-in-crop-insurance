import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "./client";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`; //changed

export const contract = getContract({
  client,
  chain: sepolia,
  address: CONTRACT_ADDRESS,
});

