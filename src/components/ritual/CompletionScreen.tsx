import { motion } from "framer-motion";
import { Trophy, RotateCcw, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompletionScreen({
  yes,
  no,
  total,
  onRestart,
}: {
  yes: number;
  no: number;
  total: number;
  onRestart?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="panel-strong rounded-2xl p-10 text-center relative overflow-hidden"
    >
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 bg-neon-green/20 blur-3xl rounded-full pointer-events-none" />
      <div className="relative mx-auto mb-5 w-fit">
        <div className="absolute inset-0 bg-neon-green/40 blur-2xl rounded-full animate-pulse-glow" />
        <div className="relative h-20 w-20 rounded-full border border-neon-green/40 bg-card/80 flex items-center justify-center mx-auto">
          <Award className="h-10 w-10 text-neon-green" />
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-[10px] font-bold tracking-wider text-neon-green uppercase mb-3">
        <Trophy className="h-3 w-3" /> Ceremony Complete
      </span>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        All <span className="text-gradient">{total} Profiles</span> Completed
      </h2>
      <p className="mt-3 text-muted-foreground">
        Your votes are permanently recorded on Ritual Testnet.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto">
        <div className="rounded-xl border border-neon-green/30 bg-neon-green/5 p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">YES votes</p>
          <p className="text-3xl font-extrabold text-neon-green mt-1 font-mono">{yes}</p>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">NO votes</p>
          <p className="text-3xl font-extrabold text-destructive mt-1 font-mono">{no}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {onRestart && (
          <Button
            variant="outline"
            onClick={onRestart}
            className="border-neon-green/30 hover:border-neon-green/70 hover:bg-neon-green/5 hover:text-neon-green"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Restart locally
          </Button>
        )}
        <Button
          onClick={() => {
            document.querySelector("aside")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="bg-neon-green text-primary-foreground font-semibold shadow-glow hover:bg-neon-green/90"
        >
          <Trophy className="h-4 w-4 mr-1" />
          View Leaderboard
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        On-chain votes can't be undone — restart only clears your local view.
      </p>
    </motion.div>
  );
}