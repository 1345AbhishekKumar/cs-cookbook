import { docs } from '@/.source';
import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute } from './shared';

const ICON_ALIASES: Record<string, string> = {
  Sliders: 'SlidersHorizontal',
  Building2: 'Building',
};

const iconAliasPlugin = {
  name: 'icon-alias',
  enforce: 'pre' as const,
  transformPageTree: {
    file(node: any) {
      if (typeof node?.icon === 'string' && ICON_ALIASES[node.icon]) {
        node.icon = ICON_ALIASES[node.icon];
      }
      return node;
    },
    folder(node: any) {
      if (typeof node?.icon === 'string' && ICON_ALIASES[node.icon]) {
        node.icon = ICON_ALIASES[node.icon];
      }
      return node;
    },
  },
};

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [iconAliasPlugin, lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
