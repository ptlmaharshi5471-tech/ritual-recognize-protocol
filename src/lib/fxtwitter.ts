export interface FxProfile {
  username: string;
  name: string;
  avatar: string | null;
  description?: string;
}

const cache = new Map<string, FxProfile>();

export async function fetchProfile(username: string): Promise<FxProfile> {
  if (cache.has(username)) return cache.get(username)!;
  const fallback: FxProfile = {
    username,
    name: username,
    avatar: null,
  };
  try {
    const res = await fetch(`https://api.fxtwitter.com/${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error("api error");
    const json = await res.json();
    const u = json?.user;
    if (!u) throw new Error("no user");
    const profile: FxProfile = {
      username: u.screen_name || username,
      name: u.name || username,
      avatar: (u.avatar_url || "").replace("_normal.", "_400x400.") || null,
      description: u.description,
    };
    cache.set(username, profile);
    return profile;
  } catch {
    cache.set(username, fallback);
    return fallback;
  }
}