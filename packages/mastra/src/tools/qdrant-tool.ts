import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { QdrantVector } from '@mastra/qdrant';
import { QueryResult } from "@mastra/core";

const vectorStore = new QdrantVector(
  'http://qdrant:6333', // Dockerサービス名を使用
);

interface QdrantSearchResponse {
  results: {
    id: string;
    score: number;
    document: string | undefined;
    metadata?: Record<string, any>;
    vector?: number[]
  }[];
}

export const qdrantTool = createTool({
  id: "qdrant-search",
  description: "Qdrantベクトルデータベースを使用してRAG検索を行います。",
  inputSchema: z.object({
    query: z.string().describe("検索クエリ"),
    collection: z.string().describe("検索対象のコレクション名").default("documents"),
    limit: z.number().describe("取得する結果の最大数").default(5),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      id: z.string(),
      score: z.number(),
      document: z.string().optional(),
      name: z.string().optional(),
    })),
  }),
  execute: async ({ context }) => {
    return await searchQdrant(context.query, context.collection, context.limit);
  },
});

const searchQdrant = async (query: string, collection: string, limit: number): Promise<QdrantSearchResponse> => {
  collection = 'midjourney'
  const queryVector = await getEmbedding(query);
  const topK = 10;

  // Query
  const data = await vectorStore.query({
    indexName: collection,
    queryVector: queryVector,
    topK: topK,
    // filter: { text: { $eq: 'doc1' } }, // optional filter
    includeVector: false // includeVector
  });
  
  return {
    results: data.map(item => ({
      id: item.id,
      score: item.score,
      document: item.document,
      metadata: item.metadata,
      vector: item.vector,
    }))
  };
};

// 簡易的な埋め込み取得関数（実際の実装では適切な埋め込みモデルを使用すること）
async function getEmbedding(text: string): Promise<number[]> {
  // 実際のプロジェクトでは、OpenAIやその他の埋め込みモデルを使用します
  // ここでは簡易的なランダム埋め込みを返します（実際の実装では置き換えてください）
  return Array.from({ length: 512 }, () => Math.random() - 0.5);
} 