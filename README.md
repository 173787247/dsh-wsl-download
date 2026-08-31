# dsh-wsl-download

DeepSeek Harness plugin: Copy an allowlisted file from the Windows Downloads folder into the WSL workspace.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-download
# or local:
dsh plugin --profile web add /absolute/path/to/dsh-wsl-download
```

Restart `dsh web` and open a **new** session. Tool: `win_download`.

## License

MIT
