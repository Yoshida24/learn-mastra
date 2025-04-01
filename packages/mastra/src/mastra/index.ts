import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { myWorkflow } from "./workflows/my-workflow";

import { weatherAgent } from './agents/weather';
import { ragAgent } from './agents/rag';
import { fooMcpAgent } from './agents/fooMcpUse';

export const mastra = new Mastra({
  agents: { weatherAgent, ragAgent, fooMcpAgent },
  workflows: {
    myWorkflow,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
