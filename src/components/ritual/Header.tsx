import { motion } from "framer-motion";
import { LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import logo from "@/assets/logo.png";

function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function Header({ onConnect }: { onConnect: () => void }) {
  const { address, balance, authenticated, disconnect } = useAppStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 w-full glass border-x-0 border-t-0 rounded-none"
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-brand blur-xl opacity-60 rounded-2xl" />
            <img src={logo} alt="Ritual Recogniser" className="relative h-10 w-10 rounded-xl" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gradient">
              Ritual Recogniser
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              On-chain member recognition · Ritual Testnet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {authenticated && address ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-xs text-muted-foreground">{balance} RITUAL</span>
                <span className="text-sm font-medium">{shorten(address)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="border-border/60 hover:border-neon-purple/60 hover:text-neon-purple"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Disconnect</span>
              </Button>
            </>
          ) : (
            <Button onClick={onConnect} className="bg-gradient-brand text-white shadow-glow hover:opacity-90">
              <Wallet className="h-4 w-4 mr-1" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}