import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import {
  connectWallet,
  signLoginMessage,
  getBalance,
  submitVoteOnChain,
  hasInjectedProvider,
} from "@/lib/web3";
import { PROFILES } from "@/lib/profiles";
import { fetchProfile, type FxProfile } from "@/lib/fxtwitter";
import { Header } from "@/components/ritual/Header";
import { ConnectGate } from "@/components/ritual/ConnectGate";
import { ProfileForm } from "@/components/ritual/ProfileForm";
import { VoteCard } from "@/components/ritual/VoteCard";
import { ProgressBar } from "@/components/ritual/ProgressBar";
import { Leaderboard, type LeaderRow } from "@/components/ritual/Leaderboard";
import { CompletionScreen } from "@/components/ritual/CompletionScreen";

type Stage = "gate" | "profile" | "voting";

const Index = () => {
  const {
    address,
    provider,
    authenticated,
    votedUsernames,
    setWallet,
    setBalance,
    setAuthenticated,
    setVotedUsernames,
    addVotedUsername,
    disconnect,
  } = useAppStore();

  const [stage, setStage] = useState<Stage>("gate");
  const [connecting, setConnecting] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileDefaults, setProfileDefaults] = useState<{ display_name?: string; x_username?: string }>({});

  const [currentProfile, setCurrentProfile] = useState<FxProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [voting, setVoting] = useState<"yes" | "no" | null>(null);

  const [leaderRows, setLeaderRows] = useState<LeaderRow[]>([]);
  const [totalYes, setTotalYes] = useState(0);
  const [totalNo, setTotalNo] = useState(0);

  // Initial stage when authenticated
  useEffect(() => {
    if (authenticated && stage === "gate") {
      setStage("profile");
    }
    if (!authenticated && stage !== "gate") {
      setStage("gate");
    }
  }, [authenticated, stage]);

  // Fetch leaderboard (full)
  const refreshLeaderboard = async () => {
    const { data, error } = await supabase
      .from("votes")
      .select("username, recognized")
      .limit(10000);
    if (error) return;
    const map = new Map<string, { yes: number; no: number }>();
    let y = 0;
    let n = 0;
    for (const v of data ?? []) {
      const row = map.get(v.username) ?? { yes: 0, no: 0 };
      if (v.recognized) {
        row.yes++;
        y++;
      } else {
        row.no++;
        n++;
      }
      map.set(v.username, row);
    }
    const rows: LeaderRow[] = Array.from(map.entries())
      .map(([username, v]) => ({ username, ...v }))
      .sort((a, b) => b.yes - a.yes || a.no - b.no);
    setLeaderRows(rows);
    setTotalYes(y);
    setTotalNo(n);
  };

  // Realtime subscription (global)
  useEffect(() => {
    refreshLeaderboard();
    const channel = supabase
      .channel("votes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        () => {
          refreshLeaderboard();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load user's voted usernames when authenticated
  useEffect(() => {
    if (!address || !authenticated) return;
    (async () => {
      const { data } = await supabase
        .from("votes")
        .select("username")
        .eq("wallet", address)
        .limit(10000);
      setVotedUsernames((data ?? []).map((r) => r.username));
    })();
  }, [address, authenticated, setVotedUsernames]);

  // Refresh balance periodically
  useEffect(() => {
    if (!provider || !address) return;
    let cancel = false;
    const tick = async () => {
      try {
        const b = await getBalance(provider, address);
        if (!cancel) setBalance(b);
      } catch {}
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => {
      cancel = true;
      clearInterval(id);
    };
  }, [provider, address, setBalance]);

  // Listen for wallet account/chain changes
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth?.on) return;
    const onAccountsChanged = (accs: string[]) => {
      if (!accs || accs.length === 0) disconnect();
      else window.location.reload();
    };
    const onChainChanged = () => window.location.reload();
    eth.on("accountsChanged", onAccountsChanged);
    eth.on("chainChanged", onChainChanged);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("chainChanged", onChainChanged);
    };
  }, [disconnect]);

  // Remaining profiles
  const remainingProfiles = useMemo(
    () => PROFILES.filter((p) => !votedUsernames.has(p)),
    [votedUsernames],
  );
  const completed = PROFILES.length - remainingProfiles.length;

  // Load next profile whenever queue changes
  const loadingRef = useRef<string | null>(null);
  useEffect(() => {
    if (stage !== "voting") return;
    if (remainingProfiles.length === 0) {
      setCurrentProfile(null);
      return;
    }
    const next = remainingProfiles[0];
    if (loadingRef.current === next) return;
    if (currentProfile?.username === next) return;
    loadingRef.current = next;
    setProfileLoading(true);
    fetchProfile(next)
      .then((p) => {
        if (loadingRef.current === next) {
          setCurrentProfile(p);
          setProfileLoading(false);
        }
      })
      .catch(() => {
        setCurrentProfile({ username: next, name: next, avatar: null });
        setProfileLoading(false);
      });
  }, [remainingProfiles, stage, currentProfile?.username]);

  // Handlers
  const handleConnect = async () => {
    if (!hasInjectedProvider()) {
      toast.error("No wallet detected", {
        description: "Please install MetaMask or another EIP-1193 wallet.",
      });
      return;
    }
    setConnecting(true);
    try {
      const { address: addr, provider: prov } = await connectWallet();
      setWallet(addr, prov);
      await signLoginMessage(prov);
      // Upsert user record
      const { data: existing } = await supabase
        .from("users")
        .select("display_name, x_username")
        .eq("wallet", addr)
        .maybeSingle();
      if (!existing) {
        await supabase.from("users").insert({ wallet: addr });
      } else {
        setProfileDefaults({
          display_name: existing.display_name ?? "",
          x_username: existing.x_username ?? "",
        });
      }
      try {
        const b = await getBalance(prov, addr);
        setBalance(b);
      } catch {}
      setAuthenticated(true);
      toast.success("Wallet connected");
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || "Could not connect";
      if (e?.code === 4001 || /reject/i.test(msg)) {
        toast.error("Request rejected");
      } else {
        toast.error("Connection failed", { description: msg });
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleSaveProfile = async (vals: { display_name: string; x_username: string }) => {
    if (!address) return;
    setSavingProfile(true);
    try {
      await supabase
        .from("users")
        .update({
          display_name: vals.display_name || null,
          x_username: vals.x_username || null,
        })
        .eq("wallet", address);
      setStage("voting");
    } catch {
      toast.error("Couldn't save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVote = async (recognized: boolean) => {
    if (!provider || !address || !currentProfile) return;
    if (voting) return;
    setVoting(recognized ? "yes" : "no");
    const username = currentProfile.username;
    try {
      // 1) On-chain
      const { txHash } = await submitVoteOnChain(provider, username, recognized);
      // 2) Save to Supabase (realtime fans this out to everyone)
      const { error } = await supabase.from("votes").insert({
        wallet: address,
        username,
        recognized,
        tx_hash: txHash,
      });
      if (error && !/duplicate|unique/i.test(error.message)) {
        throw error;
      }
      addVotedUsername(username);
      toast.success(recognized ? "Recognised ✨" : "Vote recorded", {
        description: `tx ${txHash.slice(0, 10)}…`,
      });
    } catch (e: any) {
      const msg = e?.shortMessage || e?.reason || e?.message || "Vote failed";
      if (e?.code === 4001 || e?.code === "ACTION_REJECTED" || /reject/i.test(msg)) {
        toast.error("Transaction rejected");
      } else {
        toast.error("Vote failed", { description: msg.slice(0, 140) });
      }
    } finally {
      setVoting(null);
    }
  };

  const handleRestart = () => {
    setVotedUsernames([]);
    toast.message("Local view reset", {
      description: "Your on-chain votes are still recorded.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onConnect={handleConnect} />

      <main className="flex-1">
        {stage === "gate" && (
          <ConnectGate onConnect={handleConnect} loading={connecting} />
        )}

        {stage === "profile" && (
          <ProfileForm
            defaultDisplayName={profileDefaults.display_name}
            defaultXUsername={profileDefaults.x_username}
            onSubmit={handleSaveProfile}
            saving={savingProfile}
          />
        )}

        {stage === "voting" && (
          <div className="container py-6 sm:py-10 grid lg:grid-cols-[1fr,380px] gap-6">
            <div className="space-y-5">
              <ProgressBar done={completed} total={PROFILES.length} />
              {remainingProfiles.length === 0 ? (
                <CompletionScreen
                  yes={
                    leaderRows.reduce(
                      (acc, r) => acc + (votedUsernames.has(r.username) ? r.yes : 0),
                      0,
                    ) || totalYes
                  }
                  no={totalNo}
                  total={PROFILES.length}
                  onRestart={handleRestart}
                />
              ) : (
                <VoteCard
                  profile={currentProfile}
                  loading={profileLoading}
                  voting={voting}
                  onVote={handleVote}
                />
              )}
            </div>
            <aside>
              <Leaderboard rows={leaderRows} />
            </aside>
          </div>
        )}
      </main>

      <footer className="container py-6 text-center text-xs text-muted-foreground">
        Built on Ritual Testnet · Chain ID 1979
      </footer>
    </div>
  );
};

export default Index;
