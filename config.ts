import type { ChatKitOptions } from "@openai/chatkit";

const options: ChatKitOptions = {
  api: {
    url: '/api/chat',
    domainKey: 'domain_pk_69dcec718ca48197be0432ba2aeca51d028c3d3e836f50e5',
  },
  theme: {
    colorScheme: 'dark',
    radius: 'pill',
    density: 'spacious',
    color: {
      grayscale: {
        hue: 253,
        tint: 3,
        shade: -1
      },
      accent: {
        primary: '#f2455562',
        level: 1
      }
    },
    typography: {
      baseSize: 16,
      fontFamily: '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: [
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
          weight: 400,
          style: 'normal',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Italic.woff2',
          weight: 400,
          style: 'italic',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-SemiBold.woff2',
          weight: 600,
          style: 'normal',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-SemiBoldItalic.woff2',
          weight: 600,
          style: 'italic',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2',
          weight: 700,
          style: 'normal',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-BoldItalic.woff2',
          weight: 700,
          style: 'italic',
          display: 'swap'
        }
      ]
    }
  },
  composer: {
    attachments: {
      enabled: true,
      maxCount: 5,
      maxSize: 10485760
    },
    tools: [
      {
        id: 'search_docs',
        label: 'Search docs',
        shortLabel: 'Docs',
        placeholderOverride: 'Search documentation',
        icon: 'book-open',
        pinned: false
      }
    ],
  },
  startScreen: {
    greeting: '',
    prompts: [
      {
        icon: 'circle-question',
        label: 'What is ChatKit?',
        prompt: 'What is ChatKit?'
      }
    ],
  },
};

// السطر ده هو "السر" اللي هيخلي السيرفر يشتغل وما يعملش Crash
export default options;
