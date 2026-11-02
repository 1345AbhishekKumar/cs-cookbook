import { activeModule, isScopedModuleDev, source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from "@/lib/shared";

function resolveDocPage(slugs?: string[]) {
  const pathSegments = slugs ?? [];
  const url =
    pathSegments.length > 0
      ? `/docs/${pathSegments.join("/")}`
      : `/docs/${activeModule || ""}`;

  return (
    source.getPageByUrl(url) ??
    source.getPage(slugs) ??
    (pathSegments.length === 0 ? source.getPage([]) : null)
  );
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = resolveDocPage(params.slug);

  if (!page) {
    if (isScopedModuleDev) {
      const requested = params.slug?.[0];
      return (
        <DocsPage full>
          <DocsTitle>Module Not Active in Dev Mode</DocsTitle>
          <DocsDescription>
            The dev server is currently scoped to the{" "}
            <strong>{activeModule}</strong> module for fast compile times and
            low memory usage.
          </DocsDescription>
          <div className="my-8 rounded-lg border bg-fd-card p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold text-fd-foreground">
              Want to view {requested ? `"${requested}"` : "another module"}?
            </h3>
            <p className="mb-4 text-sm text-fd-muted-foreground">
              Restart the dev server with that module active:
            </p>
            <pre className="overflow-x-auto rounded-md bg-fd-secondary p-3 text-xs text-fd-secondary-foreground">
              <code>{`$env:ACTIVE_DOCS_MODULE="${requested || "dsa"}"; npm run dev`}</code>
            </pre>
            <p className="mt-2 text-xs text-fd-muted-foreground">
              Or to enable all modules at once:
            </p>
            <pre className="mt-1 overflow-x-auto rounded-md bg-fd-secondary p-3 text-xs text-fd-secondary-foreground">
              <code>{`$env:ACTIVE_DOCS_MODULE="all"; npm run dev`}</code>
            </pre>
            <p className="mt-2 text-xs text-fd-muted-foreground">
              Or in bash / terminal:
            </p>
            <pre className="mt-1 overflow-x-auto rounded-md bg-fd-secondary p-3 text-xs text-fd-secondary-foreground">
              <code>{`ACTIVE_DOCS_MODULE=${requested || "dsa"} npm run dev`}</code>
            </pre>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`/docs/${activeModule}`}
                className="inline-flex items-center justify-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Go to Active Module ({activeModule})
              </a>
            </div>
          </div>
        </DocsPage>
      );
    }
    notFound();
  }

  const { body: MDX, toc } = await page.data.load();
  const markdownUrl = getPageMarkdownUrl(page).url;
  const contentRelativePath = isScopedModuleDev
    ? `${activeModule}/${page.path}`
    : page.path;

  return (
    <DocsPage toc={toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${contentRelativePath}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  // In development, do not pre-crawl all 789+ documents on startup
  if (process.env.NODE_ENV === "development") {
    return [];
  }
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = resolveDocPage(params.slug);
  if (!page) {
    if (isScopedModuleDev) {
      return {
        title: "Module Not Active in Dev Mode",
      };
    }
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
