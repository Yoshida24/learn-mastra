import { Step, Workflow, Mastra } from "@mastra/core";
import { z } from "zod";

// Define steps separately
const stepOne = new Step({
  id: "stepOne",
  outputSchema: z.object({
    doubledValue: z.number(),
  }),
  execute: async ({ context }) => ({
    doubledValue: context.triggerData.inputValue * 2,
  }),
});

const stepTwo = new Step({
  id: "stepTwo",
  outputSchema: z.object({
    incrementedValue: z.number(),
  }),
  execute: async ({ context }) => {
    if (context.steps.stepOne.status !== "success") {
      return { incrementedValue: 0 };
    }
    return { incrementedValue: context.steps.stepOne.output.doubledValue + 1 };
  },
});

// Build the workflow
export const myWorkflow = new Workflow({
  name: "my-workflow",
  triggerSchema: z.object({
    inputValue: z.number(),
  }),
});

myWorkflow.step(stepOne).then(stepTwo);
myWorkflow.commit();
