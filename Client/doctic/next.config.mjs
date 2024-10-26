/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['xsgames.co'], // Agrega aquí otros dominios si es necesario
  },
};

export default nextConfig;
