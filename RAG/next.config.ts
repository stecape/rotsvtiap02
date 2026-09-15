import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Evita il bundle di questi pacchetti server-side (usano native bindings o fs)
  serverExternalPackages: ["pg", "drizzle-orm", "gray-matter", "ollama"],

  // Permette le richieste dev (HMR, stack frames) dall'host Traefik
  allowedDevOrigins: ["wiki.rotsvtiap02", "wiki.rotsvtiap02:8080"],

  // x-forwarded-host (wiki.rotsvtiap02) ≠ origin (wiki.rotsvtiap02:8080) quando
  // nginx/Traefik strippano la porta — dichiariamo entrambe come trusted
  experimental: {
    serverActions: {
      allowedOrigins: ["wiki.rotsvtiap02", "wiki.rotsvtiap02:8080"],
    },
  },
}

export default nextConfig
