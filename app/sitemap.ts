import { MetadataRoute } from "next";
import { SIGNS } from "@/data/signs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://k53-success-app.vercel.app";
  const core = ["", "/practice/", "/practice/topics/", "/exam/", "/signs/", "/signs/browse/", "/mistakes/", "/about/", "/privacy/", "/terms/"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const signs = SIGNS.map((s) => ({
    url: `${base}/signs/${s.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...core, ...signs];
}
