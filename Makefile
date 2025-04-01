.PHONY: dev build down clean load-qdrant

# 開発サーバーの起動
dev:
	docker-compose up qdrant & (cd packages/mastra && npm run dev)

# 本番サーバーの起動
up:
	docker-compose up --build

# コンテナの停止と削除
down:
	docker-compose down

# コンテナのビルドのみ
build:
	docker-compose build

# コンテナ、イメージ、ボリュームの削除
clean:
	docker-compose down --rmi all --volumes
	rm -rf packages/mastra/node_modules
	rm -rf packages/mastra/dist
	rm -rf packages/mastra/.mastra

# Qdrantにデータを直接ロード
load-qdrant:
	cd packages/mastra/script && npm run load-qdrant-data
