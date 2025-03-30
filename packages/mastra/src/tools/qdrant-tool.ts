import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createTool } from "@mastra/core/tools";

// 現在のファイルのディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データファイルのパスを指定
const dataPath = path.join(__dirname, "../data/docs.txt");

// RAGツールの定義
export const qdrantTool = {
  name: "rqdrant-tool",
  description: "ベクタDBによるRAGのための検索を提供するツールです。",
  schema: z.object({
    query: z.string().describe("検索クエリ").optional(),
  }),
  async handler(params: { query?: string }) {
    try {
      const query = params.query || "マストラ";
      
      // ドキュメントの内容を読み込む
      let docContent = "";
      try {
        docContent = fs.readFileSync(dataPath, "utf-8");
      } catch (err) {
        console.error("ドキュメント読み込みエラー:", err);
        return {
          message: "ドキュメントの読み込みに失敗しました。管理者に連絡してください。"
        };
      }

      // 単純なキーワードマッチングを実行（簡易版RAG）
      const lines = docContent.split('\n');
      const matchingLines = lines.filter(line => 
        line.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingLines.length === 0) {
        return {
          message: "申し訳ありませんが、関連する情報が見つかりませんでした。別のクエリで試してみてください。"
        };
      }
      
      // 結果を整形して返す
      const formattedResults = matchingLines.map((line, index) => {
        return `情報 ${index + 1}:\n${line}\n`;
      }).join("\n");
      
      return {
        message: `検索結果:\n${formattedResults}`
      };
    } catch (error) {
      console.error("検索エラー:", error);
      return {
        message: "検索中にエラーが発生しました。もう一度お試しください。"
      };
    }
  },
} 