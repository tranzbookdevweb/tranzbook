export default async function sitemap() {
  return [
    { url: "https://www.tranzbook.co/", lastModified: new Date(), changeFreq: "monthly", priority: 1.0 },
    { url: "https://www.tranzbook.co/about-us", lastModified: new Date(), changeFreq: "monthly", priority: 0.8 },
    { url: "https://www.tranzbook.co/career", lastModified: new Date(), changeFreq: "monthly", priority: 0.7 },
    { url: "https://www.tranzbook.co/blog", lastModified: new Date(), changeFreq: "weekly", priority: 0.9 },
    { url: "https://www.tranzbook.co/privacy-policy", lastModified: new Date(), changeFreq: "yearly", priority: 0.6 },
    { url: "https://www.tranzbook.co/bus-terms-and-conditions", lastModified: new Date(), changeFreq: "yearly", priority: 0.6 },
    { url: "https://www.tranzbook.co/cargo-terms-and-conditions", lastModified: new Date(), changeFreq: "yearly", priority: 0.6 },
  ];
}