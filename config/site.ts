export const siteConfig = {
  name: "ScienceKit",
  shortName: "ScienceKit",
  description:
    "ScienceKit is a ready-to-ship e-commerce catalog for science projects, electronics models, Arduino kits, ESP32 builds, IoT systems, robotics kits, and academic working models.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  email: "rajsingh95695@gmail.com",
  phone: "9569581139",
  social: {
    instagram: "https://instagram.com/sciencekit",
    youtube: "https://youtube.com/@sciencekit",
    linkedin: "https://linkedin.com/company/sciencekit"
  }
} as const;
