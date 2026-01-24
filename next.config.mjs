/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    // Increase API route body size limit
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default nextConfig;
