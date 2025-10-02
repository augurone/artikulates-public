/** @type {import('next').NextConfig} */

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    reactStrictMode: true,
    compiler: {
        styledComponents: false
    },
    images: {
        loader: 'custom',
        loaderFile: 'scripts/contentfuImageLoader/index.js',
        remotePatterns: [
            {
                protocol: "https",
                hostname: '**'
            }
        ]
    },
    trailingSlash: true
};
