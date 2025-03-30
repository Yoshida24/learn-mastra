FROM node:22.14-slim

WORKDIR /app

# パッケージのインストール
COPY package*.json ./
RUN npm install

# TypeScriptの設定ファイルをコピー
COPY tsconfig.json ./
COPY packages/mastra/src/* /app/src/mastra/

# ソースコードをコピー
COPY packages ./packages

# Mastraが期待する場所にファイルを配置
RUN mkdir -p /app/src/mastra

EXPOSE 4111

CMD ["npm", "run", "dev"] 