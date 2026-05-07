export const mainNavigation = [
  { title: "Projects", href: "/products" },
  { title: "Categories", href: "/products?view=categories" },
  { title: "Blog", href: "/blog" },
  { title: "FAQ", href: "/faq" },
  { title: "Contact", href: "/contact" }
] as const;

export const featuredCollections = [
  {
    title: "Arduino Project Kits",
    description: "Readymade controller, sensor, automation, and embedded working models.",
    href: "/products?category=arduino"
  },
  {
    title: "ESP32 and IoT Systems",
    description: "Wi-Fi, app-control, cloud dashboard, and connected monitoring projects.",
    href: "/products?category=esp32"
  },
  {
    title: "Robotics and Working Models",
    description: "Ready robotics kits, moving mechanisms, and showcase-friendly builds.",
    href: "/products?category=robotics"
  }
] as const;
