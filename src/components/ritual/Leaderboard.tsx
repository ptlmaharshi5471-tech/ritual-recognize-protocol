import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export interface LeaderRow {
  username: string;
  yes: number;
  no: number;
}

export function Leaderboard({ rows }: { rows: LeaderRow[] }) {
  const top = rows.slice(0, 30);
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-neon-pink" />
        <h3 className="font-bold text-lg">Leading Community</h3>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No votes yet. Be the first to recognise a member.
        </p>
      ) : (
        <ul className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {top.map((row, i) => {
            const total = row.yes + row.no;
            const pct = total ? (row.yes / total) * 100 : 0;
            return (
              <motion.li
                key={row.username}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors p-3 border border-border/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono w-6 text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`https://x.com/${row.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium truncate hover:text-neon-pink"
                    >
                      @{row.username}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <span className="text-success">✓ {row.yes}</span>
                    <span className="text-muted-foreground">✗ {row.no}</span>
                  </div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-secondary/80 overflow-hidden">
                  <div
                    className="h-full bg-gradient-brand"
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