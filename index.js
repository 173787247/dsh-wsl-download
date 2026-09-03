import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/download.js";

export const name = "dsh-wsl-download";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_download",
    order: 124,
    text: "Use win_download to list/copy Windows Downloads into WSL, or action=hint for ModelScope/HF/GGUF/Flash-Next playbook (do not re-download existing shards).",
  });

  ctx.tools.register({
    name: "win_download",
    description: "List/copy files from Windows Downloads into WSL, or hint ModelScope/HF/GGUF download practices.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
    presentCall: () => ({ card: "generic", title: "win_download" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "win_download failed", content: result.content }
        : { card: "generic", title: "win_download", content: result.content }
    ),
  });
}

function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
