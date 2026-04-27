import { motion } from "framer-motion";
import { Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export function ConnectGate({ onConnect, loading }: { onConnect: () => void; loading: boolean }) {
  return (
    <div className="container flex flex-col items-center justify-center py-20 sm:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 animate-float"
      >
        <div className="absolute inset-0 bg-gradient-brand blur-3xl opacity-50 rounded-full" />
        <img src={logo} alt="" className="relative h-28 w-28 rounded-3xl shadow-glow" />
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
          className="bg-gradient-brand text-white shadow-glow hover:opacity-90 px-8 h-12 text-base"
        >
          <Wallet className="h-5 w-5 mr-2" />
          {loading ? "Connecting…" : "Connect Wallet"}
        </Button>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          { t: "Wallet sign-in", d: "Sign a message — no passwords." },
          { t: "Vote every profile", d: "Each X profile only once." },
          { t: "Live leaderboard", d: "Updates in real-time for everyone." },
        ].map((f) => (
          <div key={f.t} className="glass rounded-2xl p-5 text-left">
            <Sparkles className="h-5 w-5 text-neon-pink mb-2" />
            <h3 className="font-semibold">{f.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}