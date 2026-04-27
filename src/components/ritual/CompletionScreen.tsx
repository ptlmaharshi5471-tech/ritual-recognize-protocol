import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
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
      className="glass rounded-3xl p-10 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-brand opacity-10 pointer-events-none" />
      <Trophy className="h-14 w-14 text-neon-pink mx-auto mb-4 animate-float" />
      <h2 className="text-3xl sm:text-4xl font-extrabold">
        You've recognised <span className="text-gradient">all {total} members</span>
      </h2>
      <p className="mt-3 text-muted-foreground">
        Thank you for participating in the Ritual recognition ceremony.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="glass-strong rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">YES votes</p>
          <p className="text-3xl font-bold text-success mt-1">{yes}</p>
        </div>
        <div className="glass-strong rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">NO votes</p>
          <p className="text-3xl font-bold text-destructive mt-1">{no}</p>
        </div>
      </div>

      {onRestart && (
        <Button
          variant="outline"
          onClick={onRestart}
          className="mt-8"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Restart locally
        </Button>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        On-chain votes can't be undone — restart only clears your local view.
      </p>
    </motion.div>
  );
}