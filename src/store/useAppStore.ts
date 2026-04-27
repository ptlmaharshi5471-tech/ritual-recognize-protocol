import { create } from "zustand";
import type { ethers } from "ethers";

interface AppState {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  balance: string;
  authenticated: boolean;
  votedUsernames: Set<string>;
  setWallet: (address: string, provider: ethers.BrowserProvider) => void;
  setBalance: (balance: string) => void;
  setAuthenticated: (v: boolean) => void;
  setVotedUsernames: (list: string[]) => void;
  addVotedUsername: (u: string) => void;
  disconnect: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  address: null,
  provider: null,
  balance: "0",
  authenticated: false,
  votedUsernames: new Set(),
  setWallet: (address, provider) => set({ address, provider }),
  setBalance: (balance) => set({ balance }),
  setAuthenticated: (v) => set({ authenticated: v }),
  setVotedUsernames: (list) => set({ votedUsernames: new Set(list) }),
  addVotedUsername: (u) =>
    set((s) => {
      const next = new Set(s.votedUsernames);
      next.add(u);
      return { votedUsernames: next };
    }),
  disconnect: () =>
    set({
      address: null,
      provider: null,
      balance: "0",
      authenticated: false,
      votedUsernames: new Set(),
    }),
}));