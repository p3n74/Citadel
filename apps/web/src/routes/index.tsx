import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ExternalLink,
  Github,
  Network,
  Server,
} from "lucide-react";

import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardFooter,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/glass-card";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const GITHUB_USER = "p3n74";
const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const GITHUB_README_RAW = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_USER}/main/ReadMe.md`;

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

/** Parse profile README: about text and tech names from badge alt texts */
function parseProfileReadme(md: string): {
  about: string;
  tech: string[];
} {
  const aboutMatch = md.match(/#\s*[^\n]*[Aa]bout[^\n]*\n+([^\n#]+)/);
  const about = aboutMatch ? aboutMatch[1].trim() : "";
  const techSection = md.match(/#\s*[^\n]*[Tt]ech[^\n]*\n+([^\n#]+)/);
  const tech: string[] = [];
  if (techSection) {
    const altTexts = techSection[1].matchAll(/!\[([^\]]*)\]/g);
    for (const m of altTexts) {
      const name = m[1].trim();
      if (name && !name.startsWith("http") && !tech.includes(name)) {
        tech.push(name);
      }
    }
  }
  return { about, tech };
}

function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const { data: githubUser, isPending: userPending } = useQuery({
    queryKey: ["github-user", GITHUB_USER],
    queryFn: async (): Promise<GitHubUser> => {
      const r = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
      if (!r.ok) throw new Error("Failed to fetch");
      return r.json();
    },
    retry: 1,
  });
  const { data: readmeText } = useQuery({
    queryKey: ["github-readme", GITHUB_USER],
    queryFn: async () => {
      const r = await fetch(GITHUB_README_RAW);
      if (!r.ok) return "";
      return r.text();
    },
    retry: 1,
  });

  const profile = readmeText ? parseProfileReadme(readmeText) : null;

  return (
    <div className="relative min-h-[calc(100svh-var(--header-height,0px))] overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60"
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-14 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Citadel Network</p>
          <h1 className="font-bold tracking-tight text-foreground [text-wrap:balance] text-4xl sm:text-5xl md:text-6xl">
            Citadel Codex
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Index for the home network.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard variant="strong" className="flex flex-col">
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Server className="size-5 text-muted-foreground" />
                API Status
              </GlassCardTitle>
              <GlassCardDescription>Backend status</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block size-2.5 rounded-full ${healthCheck.data ? "bg-emerald-500 shadow-[0_0_8px_oklch(0.65_0.2_145)]" : "bg-rose-500"}`}
                />
                <span className="text-sm font-medium">
                  {healthCheck.isLoading
                    ? "Checking…"
                    : healthCheck.data
                      ? "Connected"
                      : "Disconnected"}
                </span>
              </div>
            </GlassCardContent>
            <GlassCardFooter>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-primary hover:underline"
              >
                Dashboard →
              </Link>
            </GlassCardFooter>
          </GlassCard>

          <GlassCard className="flex flex-col">
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-muted-foreground" />
                Codex
              </GlassCardTitle>
              <GlassCardDescription>Docs and runbooks</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Placeholder for internal docs.
              </p>
            </GlassCardContent>
            <GlassCardFooter>
              <span className="text-sm text-muted-foreground">—</span>
            </GlassCardFooter>
          </GlassCard>

          <GlassCard className="flex flex-col sm:col-span-2 lg:col-span-1">
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Network className="size-5 text-muted-foreground" />
                Services
              </GlassCardTitle>
              <GlassCardDescription>Local apps and tools</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Links to local services go here.
              </p>
            </GlassCardContent>
            <GlassCardFooter>
              <span className="text-sm text-muted-foreground">—</span>
            </GlassCardFooter>
          </GlassCard>
        </section>

        <section className="mt-10">
          <GlassCard variant="strong" className="overflow-hidden">
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex flex-col items-start gap-3">
                {userPending ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Github className="size-12" />
                    <span className="text-sm">Loading profile…</span>
                  </div>
                ) : githubUser ? (
                  <>
                    <a
                      href={GITHUB_PROFILE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4"
                    >
                      <img
                        src={githubUser.avatar_url}
                        alt=""
                        className="size-16 rounded-full ring-2 ring-primary/20"
                      />
                      <div className="min-w-0 text-center sm:text-left">
                        <p className="font-semibold text-foreground">
                          {githubUser.name || githubUser.login}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{githubUser.login}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {githubUser.public_repos} repos · {githubUser.followers}{" "}
                          followers · {githubUser.following} following
                        </p>
                      </div>
                    </a>
                    {profile?.about && (
                      <blockquote className="border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground italic">
                        {profile.about}
                      </blockquote>
                    )}
                    {profile?.tech && profile.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.tech.slice(0, 20).map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-muted/80 px-2 py-0.5 text-xs text-muted-foreground dark:bg-white/10"
                          >
                            {t}
                          </span>
                        ))}
                        {profile.tech.length > 20 && (
                          <span className="text-xs text-muted-foreground">
                            +{profile.tech.length - 20}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-1 text-muted-foreground">
                    <p className="font-medium text-foreground">@{GITHUB_USER}</p>
                    <p className="text-sm">Profile unavailable (rate limit or network).</p>
                  </div>
                )}
              </div>
              <a
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open GitHub
                <ExternalLink className="size-4" />
              </a>
            </div>
          </GlassCard>
        </section>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Citadel Codex
        </p>
      </main>
    </div>
  );
}
