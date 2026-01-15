import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Seed script to populate sample projects
export const seedProjects = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if projects already exist
    const existingProjects = await ctx.db.query("projects").collect();
    if (existingProjects.length > 0) {
      return { message: "Projects already seeded", count: existingProjects.length };
    }

    const sampleProjects = [
      {
        title: "DIGITAL ARTISANS",
        slug: "digital-artisans",
        year: "2024",
        category: "[BRAND IDENTITY]",
        client: "[CREATIVE STUDIO]",
        description: "A vibrant photography shoot captures the essence of modern brand identity",
        overview: `This project centers on a creative portrait session designed to reflect the innovative and dynamic spirit of the brand. The shoot features ethereal lighting and pitch-inspired color overlays, evoking a sense of movement and digital artistry. The subject's confident gaze and contemporary styling embody the brand's forward-thinking identity, while the interplay of cyan and magenta tones creates a memorable, immersive visual experience. The imagery will be used across brand touchpoints to communicate a culture of creativity, technology, and authenticity.`,
        heroImage: "/1.jpeg",
        heroImageCaption: "Artistic portrait with gloss-finished overlays and ethereal lighting",
        featured: true,
        order: 1,
      },
      {
        title: "Freewin Portfolio",
        slug: "freewin-portfolio",
        year: "2024",
        category: "[PORTFOLIO WEBSITE]",
        client: "[PERSONAL]",
        description: "A modern portfolio website showcasing creative work and technical expertise",
        overview: `A comprehensive portfolio website built with Next.js and Convex, featuring dynamic content management, smooth animations, and a clean, minimalist design. The site showcases projects, experience, education, and technical skills with an emphasis on user experience and visual storytelling.`,
        heroImage: "/logo.jpeg",
        featured: true,
        order: 2,
      },
      {
        title: "Rodias",
        slug: "rodias",
        year: "2023",
        category: "[SAAS WEBSITE]",
        client: "[STARTUP]",
        description: "A comprehensive SaaS platform for modern businesses",
        overview: `Rodias is a cutting-edge SaaS platform designed to streamline business operations. The project involved creating a scalable architecture, intuitive user interface, and robust backend systems to handle complex workflows and data management.`,
        heroImage: "/1.jpeg",
        featured: true,
        order: 3,
      },
      {
        title: "I-fineart",
        slug: "i-fineart",
        year: "2023",
        category: "[ART PORTFOLIO]",
        client: "[ARTIST]",
        description: "An elegant art portfolio website for a contemporary artist",
        overview: `I-fineart is a beautifully crafted portfolio website that showcases the artist's work in a gallery-style layout. The design emphasizes the artwork with minimal distractions, featuring high-quality image displays, smooth transitions, and an intuitive navigation system.`,
        heroImage: "/2.jpg",
        featured: false,
        order: 4,
      },
    ];

    const insertedIds = [];
    for (const project of sampleProjects) {
      const id = await ctx.db.insert("projects", project);
      insertedIds.push(id);
    }

    return { 
      message: "Successfully seeded projects", 
      count: insertedIds.length,
      ids: insertedIds 
    };
  },
});
