import React from "react";
import HeroSection from "./sections/hero";
import AboutMe from "./sections/about";
import FeaturedWork from "./sections/featuredwork";
import Experience from "./sections/experience";
import Education from "./sections/education";
import Certificates from "./sections/certificates";
import Divider from "../components/divider";
import { heroData } from "@/data/hero";

export default function Home() {
  return (
    <>
      <HeroSection heroData={heroData} />
      <Divider />
      <AboutMe />
      <Divider />
      <FeaturedWork />
      <Divider />
      <Experience />
      <Divider />
      <Education />
      <Divider />
      <Certificates />
      <Divider />
    </>
  );
}
