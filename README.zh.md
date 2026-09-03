# dsh-wsl-download

> **套件安装：** 见 [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)。

工具 **`win_download`**：

| action | 作用 |
|--------|------|
| `list` / `copy` | Windows「下载」↔ WSL 工作区 |
| `hint` | ModelScope / HF / GGUF / Flash-Next 下载 playbook（不拉网；提醒勿重复拉已有分片） |

[English → README.md](./README.md)

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-download
# 让 agent：win_download action=hint topic=flash-next
npm test
```

MIT
