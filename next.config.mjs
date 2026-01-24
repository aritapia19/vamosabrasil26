/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    // Increase API route body size (for Vercel)
    serverRuntimeConfig: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default nextConfig;
