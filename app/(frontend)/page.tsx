"use client"

import React from 'react'
import HeroSection from './sections/hero'
import AboutMe from './sections/about'
import FeaturedWork from './sections/featuredwork'
import Experience from './sections/experience'
import Education from './sections/education'
import Divider from './_components/divider'


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
    </>
  )
}
