module.exports = {
  siteUrl: "https://oguzkabasakal.com", // Your website URL
  generateRobotsTxt: true, // Generate a robots.txt file
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/404", "/500"], // Exclude non-essential pages
  additionalPaths: async (config) => {
    // This function will dynamically add paths
    const dynamicPaths = await fetchDynamicPaths();
    return dynamicPaths.map((path) => ({
      loc: path, // Full URL of the dynamic page
      lastmod: new Date().toISOString(),
    }));
  },
};

const fetchDynamicPaths = async () => {
  const dynamicData = ["/about", "/contact", "/projects", "/experience", "/threescene"];
  return dynamicData.map((slug) => `https://oguzkabasakal.com${slug}`);
};
