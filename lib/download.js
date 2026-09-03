import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";

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
        enum: ["list", "copy", "hint"],
        description:
          "list/copy Windows Downloads; hint = ModelScope/HF/GGUF download playbook (no network).",
      },
      name: { type: "string", description: "Basename to copy when action=copy (must exist in Downloads)." },
      destDir: { type: "string", description: "Destination directory (default: cwd)." },
      topic: {
        type: "string",
        enum: ["all", "modelscope", "huggingface", "gguf", "flash-next"],
        description: "hint topic (default all).",
      },
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
  for (const a of v.advice || []) lines.push(`- ${a}`);
  if (v.error) lines.push(`error: ${v.error}`);
  return lines.join("\n");
}

/** Pure download/registry playbook — no network I/O. */
export function buildDownloadHints(topic = "all") {
  const t = ["all", "modelscope", "huggingface", "gguf", "flash-next"].includes(topic)
    ? topic
    : "all";
  const tips = [];
  const want = (x) => t === "all" || t === x;

  if (want("modelscope")) {
    tips.push(
      "ModelScope (魔搭): prefer direct CN path; do not force international VPN. Check net_doctor target=registry if HTTPS fails.",
    );
    tips.push(
      "Before re-download: search local snapshots (e.g. unsloth-local/models_gguf or HuggingFace cache) and any models_gguf_local.json inventory.",
    );
  }
  if (want("huggingface")) {
    tips.push(
      "Hugging Face: often needs HTTP(S)_PROXY + NODE_USE_ENV_PROXY=1 from WSL; pair with net_doctor. Prefer huggingface-cli / modelscope already configured on Windows when files land in Downloads.",
    );
  }
  if (want("gguf") || want("flash-next")) {
    tips.push(
      "GGUF: keep shards together (*-00001-of-00003.gguf …). Do not import multi-shard Flash-Next into stock Ollama — use Unsloth Desktop / patched llama.cpp.",
    );
  }
  if (want("flash-next")) {
    tips.push(
      "Flash-Next IQ1_S: if the three shards already exist locally, skip another ~67GB pull. Point Unsloth Desktop at the existing folder.",
    );
  }
  tips.push(
    "win_download list/copy only moves files already in Windows Downloads into WSL — it does not fetch URLs. Use Windows browser or existing downloaders for the pull.",
  );
  tips.push("After copy into WSL home (not /mnt/c), verify size; then host_reach / gpu_doctor before loading.");
  return tips;
}

function downloadsDir(env = process.env) {
  const m = (env.PATH || "").match(/\/mnt\/c\/Users\/([^/]+)/);
  const user = env.WINDOWS_USER || (m ? m[1] : "");
  if (!user) return "";
  return `/mnt/c/Users/${user}/Downloads`;
}

export async function execute(args, _config = {}, deps = {}) {
  const action = ["list", "copy", "hint"].includes(args?.action) ? args.action : "list";
  if (action === "hint") {
    const topic = typeof args?.topic === "string" ? args.topic : "all";
    return { ok: true, action, topic, advice: buildDownloadHints(topic) };
  }

  const exists = deps.exists || existsSync;
  const readdir = deps.readdir || readdirSync;
  const stat = deps.stat || statSync;
  const copyFile = deps.copyFile || copyFileSync;
  const mkdir = deps.mkdir || mkdirSync;
  const env = deps.env || process.env;
  const downloads = downloadsDir(env);
  if (!downloads || !exists(downloads)) {
    return { ok: false, action, error: "Windows Downloads folder not found under /mnt/c/Users/…" };
  }
  const names = readdir(downloads).filter((n) => !n.startsWith("."));
  const files = names
    .map((name) => {
      const p = join(downloads, name);
      try {
        const st = stat(p);
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
  if (!exists(src) || !stat(src).isFile()) {
    return { ok: false, action, downloads, error: "file not found in Downloads" };
  }
  const destDir = typeof args?.destDir === "string" && args.destDir.trim()
    ? resolve(args.destDir.trim())
    : process.cwd();
  mkdir(destDir, { recursive: true });
  const dest = join(destDir, name);
  copyFile(src, dest);
  return { ok: true, action, downloads, dest, files: [{ name, size: stat(src).size }] };
}
