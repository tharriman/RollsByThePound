/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {},
    },
    output: "standalone", // Ensures it's deployable on Vercel properly

    eslint: {
        ignoreDuringBuilds: true, // Prevent ESLint errors from breaking the build
    },
};

module.exports = nextConfig;

