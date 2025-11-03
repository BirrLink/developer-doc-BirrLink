import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['intro', 'quickstart'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/overview', 'api/authentication', 'api/endpoints'],
    },
    {
      type: 'category',
      label: 'Payment Methods',
      items: ['payment-methods/overview', 'payment-methods/mobile-money', 'payment-methods/cards'],
    },
    {
      type: 'category',
      label: 'Webhook Events',
      items: ['webhooks/overview', 'webhooks/security'],
    },
    {
      type: 'category',
      label: 'SDKs & Libraries',
      items: ['sdks/overview', 'sdks/javascript', 'sdks/python', 'sdks/java'],
    },
    {
      type: 'category',
      label: 'Testing & Sandbox',
      items: ['testing/overview', 'testing/sandbox'],
    },
    {
      type: 'category',
      label: 'Security',
      items: ['security/overview', 'security/compliance'],
    },
  ],
};

export default sidebars;
