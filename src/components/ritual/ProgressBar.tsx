import { motion } from "framer-motion";

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {done} / {total} completed
        </span>
        <span className="text-muted-foreground">{total - done} remaining</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="h-full bg-gradient-brand shadow-glow"
        />
      </div>
    </div>
  );
}