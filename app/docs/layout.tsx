import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { ModuleSwitcher } from '@/components/module-switcher';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      tabs={false}
      sidebar={{ banner: <ModuleSwitcher key="module-switcher" /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}

