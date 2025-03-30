import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { QdrantVector } from '@mastra/qdrant';
import { QueryResult } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

const vectorStore = new QdrantVector(
  'http://qdrant:6333', // Dockerサービス名を使用
);

interface QdrantSearchResponse {
  results: QueryResult[];
}

export const qdrantTool = createTool({
  id: "qdrant-search",
  description: "Qdrantベクトルデータベースを使用してドキュメント検索を行います。",
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
    return await searchQdrant(context.query, context.limit, context.collection);
  },
});

const searchQdrant = async (query: string, limit: number=10, collection: string = 'movies'): Promise<QdrantSearchResponse> => {
  const queryVector = await getEmbedding(query);

  // Query
  const data = await vectorStore.query({
    indexName: 'movies',
    queryVector: queryVector,
    topK: limit,
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

// OpenAI text-embedding-3-large を使用した埋め込み生成関数
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-large'),
      value: text,
      maxRetries: 1,
    });
    
    return embedding;
  } catch (error) {
    console.error('埋め込み生成中にエラーが発生しました:', error);
    throw error;
  }
} 