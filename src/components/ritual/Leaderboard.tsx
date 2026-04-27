import { motion } from "framer-motion";
import { Trophy, Activity } from "lucide-react";

export interface LeaderRow {
  username: string;
  yes: number;
  no: number;
}

export function Leaderboard({ rows }: { rows: LeaderRow[] }) {
  const top = rows.slice(0, 30);
  return (
    <div className="panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-neon-green" />
          <h3 className="font-bold text-lg tracking-tight">Leading Community</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-neon-green uppercase">
          <Activity className="h-3 w-3" /> Live
        </span>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No votes yet. Be the first to recognise a member.
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
          {top.map((row, i) => {
            const total = row.yes + row.no;
            const pct = total ? (row.yes / total) * 100 : 0;
            const isTop = i === 0;
            return (
              <motion.li
                key={row.username}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                className={`rounded-lg p-3 border transition-all hover:scale-[1.01] hover:border-neon-green/50 ${
                  isTop
                    ? "bg-neon-green/5 border-neon-green/40 shadow-glow"
                    : "bg-card/60 border-neon-green/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-mono w-6 ${isTop ? "text-neon-green font-bold" : "text-muted-foreground"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`https://x.com/${row.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium truncate hover:text-neon-green transition-colors"
                    >
                      @{row.username}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <span className="text-neon-green">✓ {row.yes}</span>
                    <span className="text-destructive/80">✗ {row.no}</span>
                  </div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-secondary/80 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}