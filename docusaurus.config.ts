import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BirrLink',
  tagline: 'Secure and Reliable Payment Gateway for Ethiopia',
  favicon: 'img/icon.png',

  future: {
    v4: true,
  },

  url: 'https://birrlink.et',
  baseUrl: '/',

  organizationName: 'birrlink',
  projectName: 'developer-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/birrlink',
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/footer.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/720x_cover.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'BirrLink Logo',
        src: 'img/birrlink-logo.png',
        srcDark: 'img/night-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/birrlink',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{label: 'Get Started', to: '/docs/intro'}],
        },
        {
          title: 'Community',
          items: [
            {label: 'Support', href: 'mailto:support@birrlink.et'},
            {label: 'Twitter', href: 'https://twitter.com/birrlink'},
          ],
        },
        {
          title: 'More',
          items: [{label: 'GitHub', href: 'https://github.com/birrlink'}],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BirrLink. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
