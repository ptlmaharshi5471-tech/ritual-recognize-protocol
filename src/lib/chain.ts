export const RITUAL_CHAIN = {
  chainId: 1979,
  chainIdHex: "0x" + (1979).toString(16),
  chainName: "Ritual Testnet",
  nativeCurrency: { name: "Ritual", symbol: "RITUAL", decimals: 18 },
  rpcUrls: ["https://rpc.ritualfoundation.org"],
  blockExplorerUrls: ["https://explorer.ritualfoundation.org"],
};

export const CONTRACT_ADDRESS = "0xAa63555Bd06Df9D4120d231DD67F79b8cae44E78";

export const CONTRACT_ABI = [
  "function submitVote(string username, bool recognized) external",
  "function getUsers() external view returns (address[])",
  "function getStats(address user) external view returns (uint256, uint256)",
];