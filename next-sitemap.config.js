/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://palmtell.com',
  generateRobotsTxt: true,
  exclude: ['/dashboard/*', '/api/*', '/sign-in', '/sign-up'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/sign-in', '/sign-up'],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/horoscope/')) {
      priority = 0.8;
      changefreq = 'daily';
    } else if (path.includes('/learn/') || path === '/pricing') {
      priority = 0.9;
      changefreq = 'monthly';
    } else if (path === '/free-reading') {
      priority = 0.9;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
