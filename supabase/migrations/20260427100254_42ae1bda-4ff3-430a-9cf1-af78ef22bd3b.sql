-- Users table (wallet-based, no auth.users link since auth is wallet-signature)
CREATE TABLE public.users (
  wallet TEXT PRIMARY KEY,
  display_name TEXT,
  x_username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  username TEXT NOT NULL,
  recognized BOOLEAN NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT votes_wallet_username_unique UNIQUE (wallet, username)
);

CREATE INDEX votes_wallet_idx ON public.votes(wallet);
CREATE INDEX votes_username_idx ON public.votes(username);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Public read (leaderboard is public; users list is public)
CREATE POLICY "Public can read users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Public can read votes"
  ON public.votes FOR SELECT
  USING (true);

-- Public write — auth gated client-side by wallet signature
CREATE POLICY "Anyone can insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update users"
  ON public.users FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert votes"
  ON public.votes FOR INSERT
  WITH CHECK (true);

-- Enable realtime for votes
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER TABLE public.votes REPLICA IDENTITY FULL;