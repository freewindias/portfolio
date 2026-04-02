export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  client: string;
  year: string;
  website: string;
  image: string;
  additionalImages: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "branding-web-design-cleaning-services",
    title: "Branding + Web Design for Cleaning Services",
    description: "Developed a modern brand identity and a responsive web experience tailored for a professional cleaning company, focused on clarity and usability.",
    category: "Branding & Web Design",
    client: "Professional Cleaning Co.",
    year: "2024",
    website: "https://example.com",
    image: "/images/feature-work/feature-img-1.png",
    additionalImages: [
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png"
    ],
    featured: true
  },
  {
    slug: "brand-identity-health-care-company",
    title: "Brand Identity for a Health Care Company",
    description: "Created a distinctive visual identity and design language to build trust and empathy for a forward-thinking health care provider.",
    category: "Brand Identity",
    client: "HealthCare Plus",
    year: "2023",
    website: "https://example.com",
    image: "/images/feature-work/feature-img-2.png",
    additionalImages: [
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png"
    ],
    featured: true
  },
  {
    slug: "ecommerce-platform-sustainable-fashion",
    title: "E-Commerce Platform for Sustainable Fashion",
    description: "Designed a user-centric shopping experience for a fashion brand committed to sustainability and ethical production.",
    category: "E-Commerce",
    client: "Ethical Wear",
    year: "2024",
    website: "https://example.com",
    image: "/images/feature-work/feature-img-1.png",
    additionalImages: [
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png"
    ],
    featured: false
  },
  {
    slug: "mobile-app-fitness-tracking",
    title: "Mobile App for Fitness Tracking",
    description: "A sleek and intuitive mobile application that helps users track their fitness goals and monitor progress in real-time.",
    category: "Mobile Design",
    client: "FitTrack Pro",
    year: "2023",
    website: "https://example.com",
    image: "/images/feature-work/feature-img-2.png",
    additionalImages: [
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png"
    ],
    featured: false
  },
  {
    slug: "real-estate-property-management-tool",
    title: "Real Estate Property Management Tool",
    description: "Streamlining the process of property listings and tenant management for real estate professionals through a clean and effective dashboard.",
    category: "Product Design",
    client: "Estate Manager",
    year: "2024",
    website: "https://example.com",
    image: "/images/feature-work/feature-img-1.png",
    additionalImages: [
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png"
    ],
    featured: false
  },
  {
    slug: "travel-planning-booking-assistant",
    title: "Travel Planning and Booking Assistant",
    description: "An AI-powered travel assistant that simplifies the process of discovering and booking unique travel experiences worldwide.",
    category: "UX/UI Design",
    client: "Wanderlust AI",
    year: "2023",
    website: "https://example.com",
    image: "/images/feature-work/feature-img-2.png",
    additionalImages: [
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png",
      "/images/feature-work/feature-img-2.png",
      "/images/feature-work/feature-img-1.png"
    ],
    featured: false
  }
];
