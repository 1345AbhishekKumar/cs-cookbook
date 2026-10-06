import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  // `oa-home` scopes the editorial monochrome theme (see app/global.css) to the
  // home page — the class lands on the layout's <main>, so the nav is themed too.
  return (
    <HomeLayout {...baseOptions()} className="oa-home">
      {children}
    </HomeLayout>
  );
}
