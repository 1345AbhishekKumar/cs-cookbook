import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['mermaid'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'media.geeksforgeeks.org',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/html/:path*',
        destination: '/docs/full-stack-development/html/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/css/:path*',
        destination: '/docs/full-stack-development/css/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/js/:path*',
        destination: '/docs/full-stack-development/javascript/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/typescript/:path*',
        destination: '/docs/full-stack-development/typescript/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/react/:path*',
        destination: '/docs/full-stack-development/react/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/fastapi/:path*',
        destination: '/docs/full-stack-development/fastapi-backend/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/nextjs/:path*',
        destination: '/docs/full-stack-development/nextjs/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/00-languages-and-frameworks/:path*',
        destination: '/docs/full-stack-development',
        permanent: true,
      },
      {
        source: '/docs/web-foundations',
        destination: '/docs/full-stack-development',
        permanent: true,
      },
      {
        source: '/docs/web-foundations/:path*',
        destination: '/docs/full-stack-development/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/01-foundations/02-rest-and-api-design',
        destination: '/docs/full-stack-development/api-design/01-rest-and-resource-modeling',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/01-foundations/zod',
        destination: '/docs/full-stack-development/api-design/02-input-validation-zod',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/01-foundations/env-validation',
        destination: '/docs/full-stack-development/api-design/03-environment-configuration',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/01-foundations/eslint-prettier-husky',
        destination: '/docs/full-stack-development/api-design/04-code-hygiene-tooling',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/01-foundations/03-auth-and-security',
        destination: '/docs/full-stack-development/authentication/01-auth-architecture-sessions-jwt',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/01-foundations/:path*',
        destination: '/docs/full-stack-development/api-design',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/02-nextjs-fullstack/:path*',
        destination: '/docs/full-stack-development/nextjs/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/03-react-fastapi/:path*',
        destination: '/docs/full-stack-development/react-fastapi/:path*',
        permanent: true,
      },
      {
        source: '/docs/full-stack-development/04-electron-desktop/:path*',
        destination: '/docs/full-stack-development/electron-desktop/:path*',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
