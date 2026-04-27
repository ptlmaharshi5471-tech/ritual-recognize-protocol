import { ethers } from "ethers";
import { RITUAL_CHAIN, CONTRACT_ADDRESS, CONTRACT_ABI } from "./chain";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function hasInjectedProvider(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function connectWallet(): Promise<{ address: string; provider: ethers.BrowserProvider }> {
  if (!hasInjectedProvider()) {
    throw new Error("No wallet detected. Please install MetaMask or another EIP-1193 wallet.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum, "any");
  const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account selected.");
  await ensureRitualNetwork();
  return { address: ethers.getAddress(accounts[0]), provider };
}

export async function ensureRitualNetwork(): Promise<void> {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: RITUAL_CHAIN.chainIdHex }],
    });
  } catch (err: any) {
    if (err?.code === 4902 || /Unrecognized chain/i.test(err?.message || "")) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: RITUAL_CHAIN.chainIdHex,
            chainName: RITUAL_CHAIN.chainName,
            nativeCurrency: RITUAL_CHAIN.nativeCurrency,
            rpcUrls: RITUAL_CHAIN.rpcUrls,
            blockExplorerUrls: RITUAL_CHAIN.blockExplorerUrls,
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export async function signLoginMessage(provider: ethers.BrowserProvider): Promise<string> {
  const signer = await provider.getSigner();
  return signer.signMessage("Sign in to Ritual Recogniser");
}

export async function getBalance(provider: ethers.BrowserProvider, address: string): Promise<string> {
  const bal = await provider.getBalance(address);
  return Number(ethers.formatEther(bal)).toFixed(4);
}

export async function submitVoteOnChain(
  provider: ethers.BrowserProvider,
  username: string,
  recognized: boolean,
): Promise<{ txHash: string }> {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const tx = await contract.submitVote(username, recognized);
  await tx.wait();
  return { txHash: tx.hash };
}