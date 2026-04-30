export interface Project {
  id?: string;
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
  order?: number;
}

export const projectsData: Project[] = [
  {
    id: "project-1",
    slug: "freewin-dias-portfolio",
    title: "Freewin Dias Portfolio",
    description: "A full-stack portfolio application built using Next.js, Tailwind CSS, and Convex. This project serves as a professional platform to highlight my technical skills, academic background, and development projects. The backend is powered by Convex for dynamic content management and real-time data handling, while the frontend leverages Next.js for optimized performance and server-side rendering. Tailwind CSS ensures a responsive, minimalist UI with smooth animations and accessible design. The site emphasizes scalability, maintainability, and user experience through clean architecture and efficient state management.",
    category: "Portfolio Website",
    client: "Personal",
    year: "2025",
    website: "https://www.freewindias.me/",
    image: "/PortfolioWebsiteImages/projectMainIMG/logo.jpeg",
    additionalImages: [
      "/PortfolioWebsiteImages/projectMainIMG/logo.jpeg",
      "/PortfolioWebsiteImages/projectMainIMG/logo.jpeg",
    ],
    featured: true,
    order: 0,
  },
  {
    id: "project-2",
    slug: "rodias",
    title: "Rodias",
    description: "Rodias is a SaaS platform for web development built using Next.js and Tailwind CSS, designed to deliver high-performance, scalable, and visually consistent websites. The project focuses on creating fast, responsive, and SEO-optimized web solutions by leveraging server-side rendering, component reusability, and modern UI practices. Tailwind CSS ensures design uniformity and development efficiency with a fully responsive, utility-first approach. Rodias demonstrates expertise in building production-ready applications and optimizing performance across different devices and environments, reflecting a strong foundation in full-stack web architecture and frontend design systems.",
    category: "SaaS Web Development Platform",
    client: "Startup - Rodias",
    year: "2023",
    website: "https://rodias.in/",
    image: "/PortfolioWebsiteImages/projectMainIMG/rodias.png",
    additionalImages: [
      "/PortfolioWebsiteImages/projectScreenshots/RODIAS/rodias-home.png",
      "/PortfolioWebsiteImages/projectScreenshots/RODIAS/rodias-about.jpg",
      "/PortfolioWebsiteImages/projectScreenshots/RODIAS/rodias-portfolio.jpg",
      "/PortfolioWebsiteImages/projectScreenshots/RODIAS/rodias-services.jpg",
    ],
    featured: true,
    order: 1,
  },
  {
    id: "project-3",
    slug: "ifineart",
    title: "I-Fineart",
    description: "I-Fineart is an online art gallery platform built using Vanilla JavaScript, PHP, and Web3Forms, designed to professionally showcase an artist’s collection of artworks. The website features a dynamic gallery section for displaying paintings and illustrations, supported by PHP for backend logic and efficient media handling, and Web3Forms for secure contact and submission management. It includes an “About” section introducing the artist, explaining their background, creative process, and artistic inspiration, along with an “Exhibitions” section that presents a chronological timeline of past and ongoing showcases. The project emphasizes simplicity, responsive design, and optimized performance to deliver an elegant and smooth user experience.",
    category: "Art Portfolio Website",
    client: "Artist - Vikrant Belu",
    year: "2024",
    website: "https://www.i-fineart.com/",
    image: "/PortfolioWebsiteImages/projectMainIMG/ifineart.jpg",
    additionalImages: [
      "/PortfolioWebsiteImages/projectScreenshots/I-Fineart/ifineart-home.png",
      "/PortfolioWebsiteImages/projectScreenshots/I-Fineart/ifineart-about.png",
      "/PortfolioWebsiteImages/projectScreenshots/I-Fineart/ifineart-collection.png",
      "/PortfolioWebsiteImages/projectScreenshots/I-Fineart/ifineart-exhibitions.png",
      "/PortfolioWebsiteImages/projectScreenshots/I-Fineart/ifineart-contact.png",
    ],
    featured: false,
    order: 2,
  },
];
