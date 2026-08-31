import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { homedir } from "node:os";

export function notWsl() {
  return { ok: false, error: "not running in WSL" };
}

export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      action: {
        type: "string",
        enum: ["list", "copy"],
        description: "list recent files in Windows Downloads; copy one into the workspace.",
      },
      name: { type: "string", description: "Basename to copy when action=copy (must exist in Downloads)." },
      destDir: { type: "string", description: "Destination directory (default: cwd)." },
    },
  };
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}

export function format(v) {
  const lines = [`win_download action=${v.action || "?"} ok=${v.ok}`];
  if (v.downloads) lines.push(`downloads: ${v.downloads}`);
  for (const f of v.files || []) lines.push(`- ${f.name} (${f.size})`);
  if (v.dest) lines.push(`dest: ${v.dest}`);
  if (v.error) lines.push(`error: ${v.error}`);
  return lines.join("\n");
}

function downloadsDir() {
  const m = (process.env.PATH || "").match(/\/mnt\/c\/Users\/([^/]+)/);
  const user = process.env.WINDOWS_USER || (m ? m[1] : "");
  if (!user) return "";
  return `/mnt/c/Users/${user}/Downloads`;
}

export async function execute(args) {
  const action = args?.action === "copy" ? "copy" : "list";
  const downloads = downloadsDir();
  if (!downloads || !existsSync(downloads)) {
    return { ok: false, action, error: "Windows Downloads folder not found under /mnt/c/Users/…" };
  }
  const names = readdirSync(downloads).filter((n) => !n.startsWith("."));
  const files = names
    .map((name) => {
      const p = join(downloads, name);
      try {
        const st = statSync(p);
        if (!st.isFile()) return null;
        return { name, size: st.size, mtimeMs: st.mtimeMs };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 30);
  if (action === "list") return { ok: true, action, downloads, files };
  const name = typeof args?.name === "string" ? basename(args.name.trim()) : "";
  if (!name || name !== args.name?.trim() || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return { ok: false, action, downloads, error: "name must be a plain basename" };
  }
  const src = join(downloads, name);
  if (!existsSync(src) || !statSync(src).isFile()) {
    return { ok: false, action, downloads, error: "file not found in Downloads" };
  }
  const destDir = typeof args?.destDir === "string" && args.destDir.trim()
    ? resolve(args.destDir.trim())
    : process.cwd();
  if (!(destDir.startsWith(homedir()) || destDir.startsWith(process.cwd()))) {
    // soft jail: home or cwd tree
  }
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, name);
  copyFileSync(src, dest);
  return { ok: true, action, downloads, dest, files: [{ name, size: statSync(src).size }] };
}
