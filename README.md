# Clash / Mihomo 公共规则

规则与节点、私人配置分开维护。本仓库只发布规则；下载无需 GitHub token。

规则地址：`https://raw.githubusercontent.com/iceriny/clash-rules/refs/heads/main/US.yaml`，其余文件使用同一前缀。HTTP rule-provider 使用 `behavior: classical`、`format: yaml`。文件名保持不变，分流策略由使用者自己的配置指定。

规则由维护者的管理仓库统一发布，本库是公开发布结果。GitHub Actions 检查公开规则；Cloudflare 镜像由管理仓库部署，本库不存放任何部署凭据。未连接 Cloudflare 时，GitHub Raw 规则地址仍可独立使用。Cloudflare 镜像地址由部署结果给出，不会自动更改客户端的规则来源。

空集合使用 `payload: []`。运行 `npm ci` 后，`npm run check` 检查所有规则，`npm run build` 构建镜像目录。新增集合时更新 `scripts/build.mjs` 中的文件清单。
