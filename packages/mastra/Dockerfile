FROM node:22.14-slim

WORKDIR /app

# パッケージのインストール
COPY package*.json ./
RUN npm install

# TypeScriptの設定ファイルをコピー
COPY tsconfig.json ./

# ソースコードをMastraが期待する場所に直接コピー
RUN mkdir -p /app/src/mastra
COPY src /app/src/mastra

EXPOSE 4111

CMD ["npm", "run", "dev"] 