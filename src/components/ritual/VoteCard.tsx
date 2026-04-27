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
    <div className="glass rounded-3xl p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-64 w-64 bg-neon-purple/30 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-neon-pink/20 blur-3xl rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {loading || !profile ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-16"
          >
            <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
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
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-gradient-brand blur-2xl opacity-60 rounded-full animate-pulse-glow" />
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-2 border-white/20 object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
              ) : (
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-brand flex items-center justify-center text-3xl font-bold text-white">
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold">{profile.name}</h2>
            <a
              href={`https://x.com/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-neon-pink hover:underline text-sm sm:text-base"
            >
              @{profile.username}
            </a>

            {profile.description && (
              <p className="mt-4 text-sm text-muted-foreground max-w-md line-clamp-3">
                {profile.description}
              </p>
            )}

            <p className="mt-8 text-base sm:text-lg font-medium">
              Do you recognise this Ritual member?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
              <Button
                size="lg"
                onClick={() => onVote(false)}
                disabled={!!voting}
                variant="outline"
                className="h-14 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                {voting === "no" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <X className="h-5 w-5 mr-1" /> No
                  </>
                )}
              </Button>
              <Button
                size="lg"
                onClick={() => onVote(true)}
                disabled={!!voting}
                className="h-14 bg-gradient-brand text-white shadow-glow hover:opacity-90"
              >
                {voting === "yes" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-1" /> Yes
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}