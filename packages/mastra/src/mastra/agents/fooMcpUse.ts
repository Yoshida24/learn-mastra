import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { fooMcp } from "../mcp/foo-mcp";

export const fooMcpAgent = new Agent({
    name: "MCP Agent",
    instructions: `
      あなたはウェブ検索ができるエージェントです。

      【情報を求められた場合】
      webSearchToolを使用してウェブ検索を実行してください。webSearchToolは以下のパラメータを受け付けます：
      - query: 検索クエリ（必須）
      - topic: 検索カテゴリ (オプション) generalとnewsを使用できる

      回答は常に簡潔ですが情報量を保つようにしてください。ユーザーの質問に直接関連する情報を優先して提供してください。
  `,
    model: anthropic("claude-3-5-sonnet-20241022"),
    tools: await fooMcp.getTools(),
});
