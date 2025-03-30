# learn-mastra
mastra 入門

> ref. https://mastra.ai/docs

## プロジェクト構造

```
learn-mastra/
├── packages/
│   └── mastra/           # Mastraアプリケーションのメインディレクトリ
│       ├── src/          # ソースコード
│       ├── Dockerfile    # Dockerビルド設定
│       ├── package.json  # 依存関係
│       └── tsconfig.json # TypeScript設定
├── docker-compose.yml    # Docker Compose設定
└── Makefile              # 開発用コマンド
```

## 開発モードで起動

```bash
make dev
```

## Mastora 

Web UI  
http://localhost:4111/agents

Swagger UI  
http://localhost:4111/swagger-ui


## Qdrant dashboard
http://localhost:6333/dashboard#/welcome
