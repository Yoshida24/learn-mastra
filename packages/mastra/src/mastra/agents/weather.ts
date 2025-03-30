import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";

export const weatherAgent = new Agent({
    name: "Weather Agent",
    instructions: `あなたは正確な天気情報を提供する親切な天気アシスタントです。

    あなたの主な機能は、ユーザーに特定の場所の天気の詳細を提供することです。応答する際は：
    - 場所が指定されていない場合は、必ず場所を尋ねてください
    - 地名が英語でない場合は、英語に翻訳してください
    - 湿度、風の状態、降水量などの関連する詳細を含めてください
    - 回答は簡潔で有益な情報を提供してください

    天気データの取得にはweatherToolを使用してください。`,
    model: anthropic("claude-3-5-sonnet-20241022"),
    tools: { weatherTool },
});