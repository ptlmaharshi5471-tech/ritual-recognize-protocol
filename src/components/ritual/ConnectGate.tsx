import { motion } from "framer-motion";
import { Wallet, Zap, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export function ConnectGate({ onConnect, loading }: { onConnect: () => void; loading: boolean }) {
  return (
    <div className="container flex flex-col items-center justify-center py-20 sm:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-neon-green uppercase mb-6"
      >
        <span className="live-dot animate-blink" /> Live on Ritual Testnet
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 animate-float"
      >
        <div className="absolute inset-0 bg-neon-green/40 blur-3xl rounded-full" />
        <img src={logo} alt="" className="relative h-28 w-28 rounded-3xl shadow-glow ring-1 ring-neon-green/40" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl"
      >
        Recognise the <span className="text-gradient">Ritual community</span>, on-chain.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-5 max-w-xl text-muted-foreground text-base sm:text-lg"
      >
        Connect your wallet, sign in, and vote on every member of the Ritual community. Your votes are
        recorded on Ritual Testnet and aggregated into a live leaderboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <Button
          size="lg"
          onClick={onConnect}
          disabled={loading}
          className="bg-neon-green text-primary-foreground font-bold shadow-glow hover:bg-neon-green/90 hover:shadow-glow-strong px-8 h-12 text-base transition-all"
        >
          <Wallet className="h-5 w-5 mr-2" />
          {loading ? "Connecting…" : "Connect Wallet"}
        </Button>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          { Icon: Shield, t: "Wallet sign-in", d: "Sign a message — no passwords." },
          { Icon: Zap, t: "Vote every profile", d: "Each X profile only once." },
          { Icon: Activity, t: "Live leaderboard", d: "Updates in real-time for everyone." },
        ].map(({ Icon, t, d }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="panel rounded-xl p-5 text-left hover:border-neon-green/40 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg border border-neon-green/30 bg-neon-green/10 flex items-center justify-center mb-3">
              <Icon className="h-4 w-4 text-neon-green" />
            </div>
            <h3 className="font-semibold tracking-tight">{t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}