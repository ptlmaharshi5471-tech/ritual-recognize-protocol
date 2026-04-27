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
      <div className="glass rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-1">Welcome 👋</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Optionally tell us who you are. You can skip this.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="display">Display name</Label>
            <Input
              id="display"
              maxLength={50}
              placeholder="Satoshi"
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
              className="mt-1.5 bg-secondary/40 border-border/60"
            />
          </div>
          <div>
            <Label htmlFor="x">X username</Label>
            <Input
              id="x"
              maxLength={30}
              placeholder="@yourhandle"
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="mt-1.5 bg-secondary/40 border-border/60"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onSubmit({ display_name: "", x_username: "" })}
              disabled={saving}
            >
              Skip
            </Button>
            <Button
              className="flex-1 bg-gradient-brand text-white shadow-glow hover:opacity-90"
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