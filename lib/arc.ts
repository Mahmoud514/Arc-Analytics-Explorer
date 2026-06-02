import { createPublicClient, http } from "viem";

export const arcClient = createPublicClient({
  transport: http("https://rpc.testnet.arc.network"),
});
