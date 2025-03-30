import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { myWorkflow } from "./workflows/my-workflow";

import { weatherAgent } from './agents/weather';

export const mastra = new Mastra({
  agents: { weatherAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  workflows: {
    myWorkflow,
  },
});
