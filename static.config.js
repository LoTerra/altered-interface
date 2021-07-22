// This file is used to configure:
// - static-site generation
// - Document shell (index.html)
// - ...tons of other things!

// Get started at https://react-static.js.org

export default {
  plugins: ["react-static-plugin-tailwindcss"],
  getSiteData: async ({ dev }) => ({
    title: 'LoTerra is building a lottery gaming ecosystem thanks smart contracts on Terra blockchain.',
    lastBuilt: Date.now(),
  }),
  //maxThreads: 1, // Remove this when you start doing any static generation
  getRoutes: async ({ dev }) => [
    // A simple route
    {
      path: '/',
      template: 'src/pages/Index',
    },
    {
      path: 'public-sale',
      template: 'src/pages/PublicSale',
    },
    {
      path: 'staking',
      template: 'src/pages/Staking',
    },
    {
      path: 'terrand-oracle',
      template: 'src/pages/Terrand',
    },
    {
      path: 'dao',
      template: 'src/pages/DAO',
    },
    // A 404 component
    {
      path: '404',
      template: 'src/pages/NotFound',
    },
  ],
}
