// テキストをOpenAI API (text-embedding-3-large)を使って埋め込みベクトル化し、
// ローカルQdrantにアップロードするスクリプト

const fs = require('fs');
const path = require('path');
const { QdrantClient } = require('@qdrant/js-client-rest');
const OpenAI = require('openai');
// packages/mastra/.envファイルを明示的に読み込む
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// 設定
const COLLECTION_NAME = 'movies';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // 環境変数から取得
const VECTOR_SIZE = 3072; // text-embedding-3-large の次元数
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333'; // 環境変数からQdrant URLを取得

if (!OPENAI_API_KEY) {
  console.error('環境変数OPENAI_API_KEYが設定されていません');
  process.exit(1);
}

// OpenAI クライアントの初期化
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Qdrant クライアントの初期化
const qdrantClient = new QdrantClient({ url: QDRANT_URL });

// サンプルテキストとメタデータ（実際のデータに置き換えてください）
const data = [
  { 
    text: 'これは日本語のサンプルテキストです。', 
    metadata: { source: 'sample1', category: 'Japanese', date: '2023-01-01' } 
  },
  { 
    text: 'This is a sample text in English.', 
    metadata: { source: 'sample2', category: 'English', date: '2023-01-02' } 
  },
  { 
    text: 'Qdrantはベクトル検索エンジンです。', 
    metadata: { source: 'sample3', category: 'Technology', date: '2023-01-03' } 
  }
];

// コレクションが存在しない場合は作成
async function createCollectionIfNotExists() {
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      console.log(`コレクション ${COLLECTION_NAME} を作成します...`);
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine'
        }
      });

      // インデックスの作成
      console.log('インデックスを作成します...');
      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'metadata.category',
        field_schema: 'keyword'
      });
    } else {
      console.log(`コレクション ${COLLECTION_NAME} は既に存在します`);
    }
  } catch (error) {
    console.error('コレクション作成エラー:', error);
    throw error;
  }
}

// テキストをOpenAIのtext-embedding-3-largeでベクトル化
async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding生成エラー:', error);
    throw error;
  }
}

// ベクトルとメタデータをQdrantにupsert
async function uploadToQdrant(vectors) {
  try {
    // 一括upsert
    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points: vectors
    });
    console.log(`${vectors.length}件のベクトルをupsertしました`);
  } catch (error) {
    console.error('アップロードエラー:', error);
    throw error;
  }
}

// メイン処理
async function main() {
  try {
    // コレクションを確認/作成
    await createCollectionIfNotExists();

    // 各テキストをベクトル化
    const vectors = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      console.log(`テキスト ${i+1}/${data.length} をupsert/更新中...`);
      
      const embedding = await createEmbedding(item.text);
      vectors.push({
        id: i,
        vector: embedding,
        payload: {
          text: item.text,
          metadata: item.metadata
        }
      });
    }

    // ベクトルをQdrantにアップロード
    await uploadToQdrant(vectors);
    
    console.log('upsertが完了しました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// スクリプト実行
main();
