import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

export function ProfileForm({
  defaultDisplayName,
  defaultXUsername,
  onSubmit,
  saving,
}: {
  defaultDisplayName?: string;
  defaultXUsername?: string;
  onSubmit: (vals: { display_name: string; x_username: string }) => void;
  saving: boolean;
}) {
  const [display, setDisplay] = useState(defaultDisplayName ?? "");
  const [x, setX] = useState(defaultXUsername ?? "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-md py-12"
    >
      <div className="panel rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-1 tracking-tight">
          Welcome to <span className="text-gradient">Ritual</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Optionally tell us who you are. You can skip this.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="display" className="text-xs uppercase tracking-wider text-muted-foreground">Display name</Label>
            <Input
              id="display"
              maxLength={50}
              placeholder="Satoshi"
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
              className="mt-1.5 bg-secondary/60 border-neon-green/15 focus-visible:ring-neon-green/40 focus-visible:border-neon-green/50"
            />
          </div>
          <div>
            <Label htmlFor="x" className="text-xs uppercase tracking-wider text-muted-foreground">X username</Label>
            <Input
              id="x"
              maxLength={30}
              placeholder="@yourhandle"
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="mt-1.5 bg-secondary/60 border-neon-green/15 focus-visible:ring-neon-green/40 focus-visible:border-neon-green/50"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/5"
              onClick={() => onSubmit({ display_name: "", x_username: "" })}
              disabled={saving}
            >
              Skip
            </Button>
            <Button
              className="flex-1 bg-neon-green text-primary-foreground font-semibold shadow-glow hover:bg-neon-green/90"
              onClick={() =>
                onSubmit({
                  display_name: display.trim(),
                  x_username: x.trim().replace(/^@/, ""),
                })
              }
              disabled={saving}
            >
              {saving ? "Saving…" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}