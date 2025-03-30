.PHONY: dev build down clean

# 開発サーバーの起動
dev:
	docker-compose up --build

# コンテナのビルドのみ
build:
	docker-compose build

# コンテナの停止と削除
down:
	docker-compose down

# コンテナ、イメージ、ボリュームの削除
clean:
	docker-compose down --rmi all --volumes
	rm -rf node_modules
	rm -rf dist
	rm -rf .mastra 