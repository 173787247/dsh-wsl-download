# dsh-wsl-download

> **套件安装：** 见 [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)。

工具 **`win_download`**：

| action | 作用 |
|--------|------|
| `list` / `copy` | Windows「下载」↔ WSL 工作区 |
| `hint` | ModelScope / HF / GGUF / Flash-Next 下载 playbook（不拉网；提醒勿重复拉已有分片） |

[English → README.md](./README.md)

## 在套件里的位置

列出或复制 Windows 下载目录，并提示 ModelScope / Hugging Face / GGUF 路径。本身不发起下载。

```mermaid
flowchart LR
  agent["dsh agent"] --> tool["win_download"] --> win["Windows 下载目录"]
```

整套关系图和版本快照：[dsh-wsl-kit 中文说明](https://github.com/173787247/dsh-wsl-kit/blob/master/README.zh.md)。本插件是 **0.2.0**（full）。不要把那份总表抄进本 README。


## 兼容性

| 项 | 值 |
|----|----|
| **插件** | `dsh-wsl-download` **0.2.0** |
| **最低 dsh** | ≥ **0.1.2**（Windows 中继 `:3081` 一次性 `?token=`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.1.7-alpha.2`**）— 套件唯一真源 |
| **套件档位** | `full` 或单独安装 |
| **云端 Flash** | settings / `llm-deepseek` 使用 **`deepseek-flash`**（V4.1 Flash）；本插件不配置模型 id |
| **Agent Teams** | 上游实验包；本插件不依赖 |

套件版本地板：[`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh)。故障树：[TROUBLESHOOTING.zh.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.zh.md)。

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-download
# 让 agent：win_download action=hint topic=flash-next
npm test
```

MIT
