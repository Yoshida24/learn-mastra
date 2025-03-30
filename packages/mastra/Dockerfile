FROM node:22.14-slim

WORKDIR /app

# パッケージのインストール
COPY package*.json /app
RUN npm install

# TypeScriptの設定ファイルをコピー
COPY tsconfig.json /app

# ソースコードをMastraが期待する場所に直接コピー
RUN mkdir -p /app/src
COPY ./src /app/src/

EXPOSE 4111

CMD ["npm", "run", "dev"] 