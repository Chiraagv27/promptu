# Contributing to PromptPerfect

We love contributions! Here's how you can help make PromptPerfect better.

## Adding a New Optimization Mode

PromptPerfect is designed to be easily extensible. To add a new mode (e.g., "Make it Shorter" or "Fix Grammar"):

1.  **Define the Prompt**:
    Open `src/lib/prompts.ts` and add a new exported constant for your system prompt.
    ```typescript
    export const SHORTER_PROMPT = `... your system prompt here ...`;
    ```
    Then update the `getSystemPrompt` function to include your new mode.

2.  **Update the UI**:
    Open `src/components/ModeSelector.tsx` and add your new mode to the `MODES` array.
    ```typescript
    const MODES = [
      // ... existing modes
      { value: 'shorter', label: 'Make it Shorter' },
    ];
    ```

3.  **Update Types**:
    Open `src/lib/types.ts` and add your new mode string to the `OptimizationMode` type.
    ```typescript
    export type OptimizationMode = 'better' | 'specific' | 'cot' | 'shorter';
    ```

That's it! The app handles the rest automatically.

## Running Locally

1.  Clone the repo.
2.  `npm install`
3.  `cp .env.example .env.local` and add your API keys.
4.  `npm run dev`
