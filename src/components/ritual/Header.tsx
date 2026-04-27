import { motion } from "framer-motion";
import { LogOut, Wallet, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import logo from "@/assets/logo.png";

function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function Header({ onConnect }: { onConnect: () => void }) {
  const { address, balance, authenticated, disconnect, xUsername } = useAppStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 w-full bg-background/70 backdrop-blur-md border-b border-neon-green/20 shadow-[0_1px_0_0_hsl(var(--neon-green)/0.15)]"
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-green/40 blur-xl opacity-70 rounded-2xl" />
            <img src={logo} alt="Ritual Recogniser" className="relative h-10 w-10 rounded-xl ring-1 ring-neon-green/40" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                Ritual <span className="text-gradient">Recogniser</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-neon-green uppercase">
                <span className="live-dot animate-blink" />
                Live on Ritual
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              On-chain member recognition · Chain ID 1979
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {authenticated && address ? (
            <>
              {xUsername && (
                <a
                  href={`https://x.com/${xUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 px-3 py-1.5 text-xs font-medium text-neon-green hover:bg-neon-green/10 transition-colors"
                  title="Your X profile"
                >
                  <Twitter className="h-3.5 w-3.5" />@{xUsername}
                </a>
              )}
              <div className="hidden sm:flex flex-col items-end leading-tight font-mono">
                <span className="text-[11px] text-neon-green">{Number(balance).toFixed(3)} RITUAL</span>
                <span className="text-sm font-semibold text-foreground">{shorten(address)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="border-neon-green/30 text-foreground hover:border-neon-green/70 hover:text-neon-green hover:bg-neon-green/5"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Disconnect</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={onConnect}
              className="bg-neon-green text-primary-foreground font-semibold shadow-glow hover:bg-neon-green/90 hover:shadow-glow-strong transition-all"
            >
              <Wallet className="h-4 w-4 mr-1" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}