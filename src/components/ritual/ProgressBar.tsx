import { motion } from "framer-motion";

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="panel rounded-2xl p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold tracking-tight">
          <span className="text-neon-green font-mono">{done}</span>
          <span className="text-muted-foreground"> / {total} completed</span>
        </span>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {total - done} remaining · {pct}%
        </span>
      </div>
      <div className="mt-2.5 h-2 w-full rounded-full bg-secondary/60 overflow-hidden border border-neon-green/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green shadow-glow"
        />
      </div>
    </div>
  );
}