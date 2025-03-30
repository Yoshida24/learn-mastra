import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { qdrantTool } from "../tools/qdrant-tool";

export const ragAgent = new Agent({
    name: "RAG Agent",
    instructions: `あなたはRetrieval Augmented Generation (RAG) のアシスタントです。

    あなたの役割は、ユーザーからの質問に対して、正確で有益な情報を提供することです。
    回答の際には、以下のガイドラインに従ってください。
    
    1. 取得した情報をベースに、簡潔かつ分かりやすく回答を構成してください
    2. 技術的な用語を使う場合は、必要に応じて簡単な説明を加えてください
    4. 情報が不足している場合は、その旨を伝え、より詳細な質問を促してください
    
    情報を検索するには、qdrantToolを使用してください。このツールは、ドキュメントから情報を検索して提供します。`,
    model: anthropic("claude-3-5-sonnet-20241022"),
    tools: { qdrantTool },
}); 