# Seedance Gallery 部署指南

## 环境要求

- Node.js >= 18
- pnpm >= 9

## 部署步骤

```bash
# 1. 解压
tar -xzf seedance-gallery-deploy.tar.gz

# 2. 安装依赖
pnpm install --frozen-lockfile

# 3. 配置环境变量（复制示例文件并按需修改）
cp .env.example .env.local

# 4. 启动服务（默认端口 3000）
pnpm start

# 自定义端口
PORT=8080 pnpm start
```

## 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `PROMPTS_LIB_URL` | ✅ | Prompts Lib API 地址，不要带末尾斜杠 |
| `YOUBASE_URL` | ❌ | 旧变量名，未设置 `PROMPTS_LIB_URL` 时回退读它；值须指向同一个 Prompts Lib API |
| `PORT` | ❌ | 服务端口，默认 3000 |

## 注意事项

- 已包含预构建的 `.next/` 目录，安装依赖后可直接 `pnpm start`
- 数据从 Prompts Lib 实时拉取，更新上游内容后用户刷新页面即可看到
- 页面只取 Seedance 2.5（请求带 `model=seedance-2.5`）——上游同一张表里也存着 2.0 的数据
- API 地址仅在服务端使用，不会暴露给浏览器；视频与封面走 `/api/video/*` 代理
- 建议前面加 Nginx/Caddy 反向代理处理 HTTPS
