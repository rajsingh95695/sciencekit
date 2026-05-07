import process from "node:process";

import mongoose from "mongoose";

const args = process.argv.slice(2);
const getArg = (flag, fallback = "") => {
  const index = args.findIndex((item) => item === flag);
  return index >= 0 ? args[index + 1] || fallback : fallback;
};

const productsPerSubcategory = Number(getArg("--per-subcategory", "101"));
const batchSize = Number(getArg("--batch-size", "500"));

const slugify = (input) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const taxonomy = [
  {
    name: "Arduino Projects",
    slug: "arduino",
    image: "/catalog/arduino.svg",
    basePrice: 1499,
    tags: ["arduino", "electronics", "controller"],
    components: ["Arduino Uno", "Breadboard", "Jumper wires", "LCD display", "Relay module", "Sensor pack"],
    subcategories: [
      ["Automation Systems", "automation-systems"],
      ["Sensor Projects", "sensor-projects"],
      ["Display Modules", "display-modules"],
      ["Monitoring Systems", "monitoring-systems"],
      ["Agriculture Projects", "agriculture-projects"],
      ["Security Circuits", "security-circuits"],
      ["Control Panels", "control-panels"],
      ["Power Projects", "power-projects"],
      ["Communication Projects", "communication-projects"],
      ["Embedded Trainers", "embedded-trainers"]
    ]
  },
  {
    name: "ESP32 Projects",
    slug: "esp32",
    image: "/catalog/esp32.svg",
    basePrice: 2399,
    tags: ["esp32", "wifi", "iot"],
    components: ["ESP32 board", "Wi-Fi module", "Relay board", "OLED display", "Mobile app control", "Power adapter"],
    subcategories: [
      ["Wi-Fi Automation", "wifi-automation"],
      ["Bluetooth Devices", "bluetooth-devices"],
      ["Data Logging", "data-logging"],
      ["Remote Monitoring", "remote-monitoring"],
      ["Camera Systems", "camera-systems"],
      ["Dashboard Projects", "dashboard-projects"],
      ["Home Control", "home-control"],
      ["Industrial Monitoring", "industrial-monitoring"],
      ["Wearable Devices", "wearable-devices"],
      ["Mobile App Projects", "mobile-app-projects"]
    ]
  },
  {
    name: "IoT Projects",
    slug: "iot",
    image: "/catalog/iot.svg",
    basePrice: 2999,
    tags: ["iot", "cloud", "monitoring"],
    components: ["Node controller", "Cloud dashboard", "Sensor array", "Enclosure", "Power supply", "Calibration guide"],
    subcategories: [
      ["Smart Agriculture", "smart-agriculture"],
      ["Smart City", "smart-city"],
      ["Water Management", "water-management"],
      ["Energy Monitoring", "energy-monitoring"],
      ["Environmental Monitoring", "environmental-monitoring"],
      ["Asset Tracking", "asset-tracking"],
      ["Cloud Control", "cloud-control"],
      ["Health Monitoring", "health-monitoring"],
      ["Telemetry Systems", "telemetry-systems"],
      ["Industrial IoT", "industrial-iot"]
    ]
  },
  {
    name: "Robotics Kits",
    slug: "robotics",
    image: "/catalog/robotics.svg",
    basePrice: 3299,
    tags: ["robotics", "motion", "mechatronics"],
    components: ["Motor driver", "Chassis", "Wheel set", "Sensor kit", "Controller board", "Battery pack"],
    subcategories: [
      ["Line Follower", "line-follower"],
      ["Obstacle Avoidance", "obstacle-avoidance"],
      ["Robotic Arm", "robotic-arm"],
      ["Gesture Control", "gesture-control"],
      ["Voice Control", "voice-control"],
      ["Fire Fighting", "fire-fighting"],
      ["Surveillance Bot", "surveillance-bot"],
      ["Pick and Place", "pick-and-place"],
      ["Mechatronics Models", "mechatronics-models"],
      ["Autonomous Systems", "autonomous-systems"]
    ]
  },
  {
    name: "School Models",
    slug: "school-models",
    image: "/catalog/school-models.svg",
    basePrice: 899,
    tags: ["school", "science-model", "working-model"],
    components: ["Model base", "Printed labels", "Presentation board", "Working mechanism", "Assembly kit", "Guide sheet"],
    subcategories: [
      ["Environment Models", "environment-models"],
      ["Water Cycle Models", "water-cycle-models"],
      ["Energy Models", "energy-models"],
      ["Agriculture Models", "agriculture-models"],
      ["Human Body Models", "human-body-models"],
      ["Transport Models", "transport-models"],
      ["Working Science Models", "working-science-models"],
      ["Exhibition Models", "exhibition-models"],
      ["Classroom Models", "classroom-models"],
      ["Project Board Models", "project-board-models"]
    ]
  },
  {
    name: "College Projects",
    slug: "college-projects",
    image: "/catalog/college-projects.svg",
    basePrice: 3599,
    tags: ["college-project", "engineering", "final-year"],
    components: ["Project report", "Circuit assembly", "Controller board", "Sensors", "Power unit", "Implementation notes"],
    subcategories: [
      ["Final Year Projects", "final-year-projects"],
      ["Mini Projects", "mini-projects"],
      ["Diploma Projects", "diploma-projects"],
      ["Research Prototypes", "research-prototypes"],
      ["Automation Projects", "automation-projects"],
      ["Innovation Models", "innovation-models"],
      ["Lab Projects", "lab-projects"],
      ["Embedded Projects", "embedded-projects"],
      ["Instrumentation Projects", "instrumentation-projects"],
      ["Industry Ready Models", "industry-ready-models"]
    ]
  },
  {
    name: "Physics Models",
    slug: "physics-models",
    image: "/catalog/physics-models.svg",
    basePrice: 1099,
    tags: ["physics", "lab-model", "experiment"],
    components: ["Experiment base", "Measured components", "Display panel", "Instruction set", "Illustration card", "Sample readings"],
    subcategories: [
      ["Mechanics Models", "mechanics-models"],
      ["Optics Models", "optics-models"],
      ["Electricity Models", "electricity-models"],
      ["Magnetism Models", "magnetism-models"],
      ["Sound Models", "sound-models"],
      ["Thermal Models", "thermal-models"],
      ["Fluid Models", "fluid-models"],
      ["Wave Models", "wave-models"],
      ["Motion Models", "motion-models"],
      ["Modern Physics Models", "modern-physics-models"]
    ]
  },
  {
    name: "Chemistry Models",
    slug: "chemistry-models",
    image: "/catalog/chemistry-models.svg",
    basePrice: 999,
    tags: ["chemistry", "molecule", "lab-model"],
    components: ["Acrylic stand", "Model kit", "Display labels", "Illustration panel", "Experiment guide", "Presentation tray"],
    subcategories: [
      ["Molecular Models", "molecular-models"],
      ["Reaction Setup Models", "reaction-setup-models"],
      ["Acid Base Models", "acid-base-models"],
      ["Separation Models", "separation-models"],
      ["Electrochemistry Models", "electrochemistry-models"],
      ["Organic Chemistry Models", "organic-chemistry-models"],
      ["Polymer Models", "polymer-models"],
      ["Crystal Models", "crystal-models"],
      ["Lab Apparatus Models", "lab-apparatus-models"],
      ["Green Chemistry Models", "green-chemistry-models"]
    ]
  },
  {
    name: "Biology Models",
    slug: "biology-models",
    image: "/catalog/biology-models.svg",
    basePrice: 1199,
    tags: ["biology", "anatomy", "education"],
    components: ["Display frame", "Model body", "Instruction card", "Printed labels", "Academic notes", "Presentation support"],
    subcategories: [
      ["Anatomy Models", "anatomy-models"],
      ["Botany Models", "botany-models"],
      ["Cell Biology Models", "cell-biology-models"],
      ["Genetics Models", "genetics-models"],
      ["Ecology Models", "ecology-models"],
      ["Microbiology Models", "microbiology-models"],
      ["Zoology Models", "zoology-models"],
      ["Biotechnology Models", "biotechnology-models"],
      ["Physiology Models", "physiology-models"],
      ["Health Science Models", "health-science-models"]
    ]
  },
  {
    name: "Renewable Energy Projects",
    slug: "renewable-energy",
    image: "/catalog/renewable-energy.svg",
    basePrice: 1899,
    tags: ["renewable-energy", "solar", "sustainable"],
    components: ["Energy module", "Working base", "Controller unit", "Display board", "Conversion kit", "Guide manual"],
    subcategories: [
      ["Solar Projects", "solar-projects"],
      ["Wind Energy Models", "wind-energy-models"],
      ["Hydro Projects", "hydro-projects"],
      ["Hybrid Systems", "hybrid-systems"],
      ["Energy Storage", "energy-storage"],
      ["Smart Grid Projects", "smart-grid-projects"],
      ["EV Charging Models", "ev-charging-models"],
      ["Inverter Systems", "inverter-systems"],
      ["Efficiency Projects", "efficiency-projects"],
      ["Sustainable Systems", "sustainable-systems"]
    ]
  }
];

const audiences = [
  "schools",
  "colleges",
  "coaching institutes",
  "science exhibitions",
  "engineering labs",
  "retail buyers",
  "institutional buyers",
  "project resellers"
];

const finishWords = [
  "Starter",
  "Advanced",
  "Premium",
  "Compact",
  "Smart",
  "Pro",
  "Integrated",
  "Lab",
  "Exhibition",
  "Industrial",
  "Academic"
];

const formatWords = [
  "Project Kit",
  "Working Model",
  "Prototype",
  "Trainer Board",
  "Control System",
  "Experiment Pack",
  "Learning Kit",
  "Research Build",
  "Display Model",
  "Ready Unit"
];

const difficultyLevels = ["Easy", "Medium", "Hard"];

const bannerPayload = [
  {
    title: "10,000+ science projects, electronics kits, and working models",
    subtitle: "Browse category-wise products for schools, colleges, labs, institutions, and resellers from one storefront.",
    image: "/catalog/arduino.svg",
    link: "/products",
    active: true
  },
  {
    title: "Category-wise catalog for Arduino, ESP32, IoT, robotics, and science models",
    subtitle: "Search-ready product titles, structured descriptions, and fast browsing across science and electronics categories.",
    image: "/catalog/robotics.svg",
    link: "/products",
    active: true
  },
  {
    title: "Bulk orders, repeat supply, and custom sourcing support",
    subtitle: "ScienceKit supports retail buyers, institutes, labs, and project sellers with a ready product catalog.",
    image: "/catalog/school-models.svg",
    link: "/contact",
    active: true
  }
];

const faqPayload = [
  {
    question: "Does ScienceKit supply readymade science projects and electronics models?",
    answer: "Yes. ScienceKit focuses on ready-to-ship science projects, electronics kits, and working models across multiple categories.",
    active: true,
    order: 1
  },
  {
    question: "Can I place bulk orders for schools, colleges, or institutions?",
    answer: "Yes. You can contact ScienceKit for bulk quantity, repeat supply, and category-based institutional orders.",
    active: true,
    order: 2
  },
  {
    question: "Are projects categorized by topic and technology?",
    answer: "Yes. Products are organized across categories such as Arduino, ESP32, IoT, Robotics, School Models, College Projects, Physics, Chemistry, Biology, and Renewable Energy.",
    active: true,
    order: 3
  }
];

const blogPayload = [
  {
    title: "How to choose the right science project category for your requirement",
    slug: "choose-the-right-science-project-category",
    excerpt: "A practical guide to picking the right category, budget, and working model type for your audience.",
    content:
      "<p>ScienceKit helps buyers browse projects by category, purpose, and difficulty level. Start by choosing the right category such as Arduino, ESP32, school science models, or renewable energy projects.</p><p>Then compare price, complexity, audience fit, and stocking requirements before placing an order.</p>",
    published: true,
    featured: true,
    tags: ["sciencekit", "project guide", "catalog"]
  },
  {
    title: "Why categorized project catalogs improve buyer conversion",
    slug: "why-categorized-project-catalogs-improve-buyer-conversion",
    excerpt: "Category-wise storefronts help customers search faster and purchase with more confidence.",
    content:
      "<p>A large project catalog becomes easier to navigate when products are grouped by category, subcategory, and use case. Search suggestions and structured naming reduce friction for first-time buyers.</p>",
    published: true,
    featured: false,
    tags: ["ecommerce", "catalog", "search"]
  }
];

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed the ScienceKit catalog.");
}

await mongoose.connect(process.env.MONGODB_URI);

const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const categorySchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const bannerSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const blogSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const faqSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogSchema);
const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);

for (const root of taxonomy) {
  const rootDoc = await Category.findOneAndUpdate(
    { slug: root.slug },
    {
      name: root.name,
      slug: root.slug,
      image: root.image,
      parentCategory: null
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );

  for (const [subcategoryName, subcategorySlug] of root.subcategories) {
    await Category.findOneAndUpdate(
      { slug: `${root.slug}-${subcategorySlug}` },
      {
        name: subcategoryName,
        slug: `${root.slug}-${subcategorySlug}`,
        image: root.image,
        parentCategory: rootDoc._id
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );
  }
}

for (const banner of bannerPayload) {
  await Banner.findOneAndUpdate({ title: banner.title }, banner, {
    upsert: true,
    returnDocument: "after"
  });
}

for (const faq of faqPayload) {
  await FAQ.findOneAndUpdate({ question: faq.question }, faq, {
    upsert: true,
    returnDocument: "after"
  });
}

for (const post of blogPayload) {
  await BlogPost.findOneAndUpdate({ slug: post.slug }, post, {
    upsert: true,
    returnDocument: "after"
  });
}

const operations = [];
let totalProducts = 0;

for (const root of taxonomy) {
  for (const [subIndex, [subcategoryName, subcategorySlug]] of root.subcategories.entries()) {
    const subcategoryKey = `${root.slug}-${subcategorySlug}`;

    for (let index = 1; index <= productsPerSubcategory; index += 1) {
      const finish = finishWords[(index - 1) % finishWords.length];
      const format = formatWords[Math.floor((index - 1) / finishWords.length) % formatWords.length];
      const difficulty = difficultyLevels[(index + root.slug.length) % difficultyLevels.length];
      const audience = audiences[(index + subcategoryName.length) % audiences.length];
      const componentStart = index % root.components.length;
      const componentsIncluded = [
        root.components[componentStart % root.components.length],
        root.components[(componentStart + 1) % root.components.length],
        root.components[(componentStart + 2) % root.components.length],
        root.components[(componentStart + 3) % root.components.length]
      ];
      const name = `${subcategoryName} ${finish} ${format} ${String(index).padStart(3, "0")}`;
      const slug = slugify(`${root.slug}-${subcategorySlug}-${finish}-${format}-${index}`);
      const price = root.basePrice + (index % 9) * 180 + subIndex * 95;
      const discountPrice = Math.max(price - (150 + (index % 5) * 40), Math.floor(price * 0.84));
      const trendingScore = 1000 - index + subIndex * 3;
      const description = `
        <p>${name} is a ready-to-ship ${root.name.toLowerCase()} product listed by ScienceKit for ${audience}.</p>
        <p>This catalog item is grouped under <strong>${root.name}</strong> and <strong>${subcategoryName}</strong>. It includes ${componentsIncluded.join(", ")} and is suitable for display, teaching, or project supply requirements.</p>
        <p>ScienceKit maintains category-wise titles, descriptions, and stock-ready listings to help buyers compare products quickly.</p>
      `.trim();

      operations.push({
        updateOne: {
          filter: { slug },
          update: {
            $set: {
              name,
              slug,
              description,
              category: root.slug,
              subcategory: subcategoryKey,
              price,
              discountPrice,
              stock: 6 + (index % 24),
              images: [{ url: root.image, alt: name }],
              difficulty,
              componentsIncluded,
              tags: [...new Set([root.slug, subcategorySlug, finish.toLowerCase(), ...root.tags])],
              ratings: Number((3.8 + ((index + root.slug.length) % 10) * 0.1).toFixed(1)),
              reviewsCount: 8 + ((index * (root.slug.length + 2)) % 160),
              featured: index <= 2,
              trendingScore
            }
          },
          upsert: true
        }
      });

      totalProducts += 1;

      if (operations.length >= batchSize) {
        await Product.bulkWrite(operations.splice(0, operations.length), { ordered: false });
        console.log(`Seeded ${totalProducts} products so far...`);
      }
    }
  }
}

if (operations.length) {
  await Product.bulkWrite(operations, { ordered: false });
}

console.log(`ScienceKit catalog ready with ${totalProducts} generated products.`);
await mongoose.disconnect();
