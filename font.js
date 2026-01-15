// src/fonts.js (example utility file)
import { Inter, Audiowide } from "@next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap", // optional, for font loading strategy
});

export const audiowide = Audiowide({
  weight: ["400"], // specify desired weights
  subsets: ["latin"],
  display: "swap",
  variable: "--font-asi", // optional, for CSS variable usage
});
