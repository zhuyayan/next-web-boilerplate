/** @type {import('next').NextConfig} */
let nextConfig;

switch (process.env.NODE_ENV) {
    case 'development':
        nextConfig = {
            env: {
                NEXT_PUBLIC_BASE_API: 'http://192.168.2.33:56567/api/v1/',
                NEXT_PUBLIC_WEBSOCKET_ADDR: 'ws://192.168.2.33:56567/api/v1/',
            }
        };
        break;
    case 'test':
        nextConfig = {
            env: {
                NEXT_PUBLIC_BASE_API: 'http://172.16.5.10:56567/api/v1/'
            }
        };
        break;
    case 'production':
        nextConfig = {
            env: {
                NEXT_PUBLIC_BASE_API: 'http://192.168.2.33:56567/api/v1/',
                NEXT_PUBLIC_WEBSOCKET_ADDR: 'ws://192.168.2.33:56567/api/v1/',
            }
        };
        break;
    default:
        nextConfig = {
            env: {
                NEXT_PUBLIC_BASE_API: 'http://172.16.5.10:56567/api/v1/'
            }
        };
        break;
}

// NODE_ENV=development npm run dev
// NODE_ENV=test npm run test
// NODE_ENV=production npm run build

module.exports = nextConfig
