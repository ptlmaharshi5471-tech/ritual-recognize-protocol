import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FxProfile } from "@/lib/fxtwitter";

export function VoteCard({
  profile,
  loading,
  voting,
  onVote,
}: {
  profile: FxProfile | null;
  loading: boolean;
  voting: "yes" | "no" | null;
  onVote: (recognized: boolean) => void;
}) {
  return (
    <div className="panel rounded-2xl p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 bg-neon-green/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />

      <AnimatePresence mode="wait">
        {loading || !profile ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-16"
          >
            <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            <p className="text-sm text-muted-foreground mt-3">Loading next profile…</p>
          </motion.div>
        ) : (
          <motion.div
            key={profile.username}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-neon-green/50 blur-2xl rounded-full animate-pulse-glow" />
              <div className="relative rounded-full p-[2px] bg-gradient-to-br from-neon-green via-neon-cyan to-neon-green/30">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover bg-card block"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                ) : (
                  <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full bg-card flex items-center justify-center text-3xl font-bold text-neon-green">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.name}</h2>
            <a
              href={`https://x.com/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-neon-green hover:text-neon-cyan text-sm sm:text-base font-mono mt-1 transition-colors"
            >
              @{profile.username}
            </a>

            {profile.description && (
              <p className="mt-4 text-sm text-muted-foreground max-w-md line-clamp-3 leading-relaxed">
                {profile.description}
              </p>
            )}

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-neon-green/25 bg-neon-green/5 px-4 py-1.5">
              <span className="live-dot" />
              <p className="text-sm font-medium tracking-wide">
                Do you recognise this Ritual member?
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
              <motion.div whileTap={{ scale: 0.96 }}>
                <Button
                  size="lg"
                  onClick={() => onVote(false)}
                  disabled={!!voting}
                  variant="outline"
                  className="w-full h-14 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive font-semibold"
                >
                  {voting === "no" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <X className="h-5 w-5 mr-1" /> No
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.96 }}>
                <Button
                  size="lg"
                  onClick={() => onVote(true)}
                  disabled={!!voting}
                  className="w-full h-14 bg-neon-green text-primary-foreground font-bold shadow-glow hover:bg-neon-green/90 hover:shadow-glow-strong transition-all"
                >
                  {voting === "yes" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-1" /> Yes
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            {voting && (
              <p className="mt-4 text-xs text-muted-foreground font-mono">
                Submitting transaction to Ritual Testnet…
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}