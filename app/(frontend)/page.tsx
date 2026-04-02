import React from 'react'
import HeroSection from './_components/home/hero-section'
import AboutMe from './_components/home/about-me'
import FeaturedWork from './_components/home/featured-work'
import Experience from './_components/home/experience'
import Education from './_components/home/education'
import Divider from './_components/divider'
import Footer from './_components/footer'
import ProjectOverview from './_components/home/project-overview'


export default function Home() {
  return (
    <>
      <HeroSection/>
      <Divider/>
      <AboutMe/>
      <Divider/>
      <FeaturedWork/>
      <Divider/>
      <Experience/>
      <Divider/>
      <Education/>
      <Divider/>
      <ProjectOverview/>
      <Divider/>
      <Footer/>
    </>
  )
}
