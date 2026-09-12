# dsh-wsl-download
> **Install set:** part of [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit).

Tool **`win_download`**: `list`/`copy` Windows Downloads into WSL, or `hint` for ModelScope/HF/GGUF/Flash-Next playbooks (no network; skip re-downloading existing shards).

[中文说明 → README.zh.md](./README.zh.md)

## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-download` **0.2.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.1.5-rc.1`**) — single source of truth for the suite |
| **Kit set** | `full` or install alone |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |

Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-download
npm test
```

MIT
