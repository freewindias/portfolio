"use client"

import VerticalCutReveal from '@/components/fancy/vertical-cut-reveal'
import { audiowide } from '@/font'
import React, { useEffect, useRef } from 'react'
import ICON from "@/public/heroIcons/coffee.json"
import { Player } from "@lordicon/react"
import { motion } from "motion/react";
import Linkedin from "@/public/heroIcons/linkedin.json"
import Github from "@/public/heroIcons/github.json"
import Mail from "@/public/heroIcons/mail.json"
import Link from "next/link"


export default function Hero() {
  const birthDate = new Date(2002, 11, 6);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const playerRef = useRef<Player>(null);
  useEffect(() => {
    setTimeout(() => {
      playerRef.current?.playFromBeginning();
    }, 900);
  }, []);

  const linkedinRef = useRef<Player>(null);
  useEffect(() => {
    setTimeout(() => {
      linkedinRef.current?.playFromBeginning();
    }, 1200);
  }, []);

  const githubRef = useRef<Player>(null);
  useEffect(() => {
    setTimeout(() => {
      githubRef.current?.playFromBeginning();
    }, 1300);
  }, []);

  const mailRef = useRef<Player>(null);
  useEffect(() => {
    setTimeout(() => {
      mailRef.current?.playFromBeginning();
    }, 2600);
  }, []); 

  return (
    <section className='h-full pb-56 md:pb-64'>
      <div className='flex mt-36 md:mt-48'>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerDelay={0.5}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName={`${audiowide.className} text-[35px] md:text-7xl lg:text-[110px] tracking-tighter`}
        >
          {`Game.`}
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerDelay={0.6}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName={`${audiowide.className} text-[35px] md:text-7xl lg:text-[110px] tracking-tighter`}
        >
          {`Web.`}
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerDelay={0.7}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName={`${audiowide.className} text-[35px] md:text-7xl lg:text-[110px] tracking-tighter`}
        >
          {`Develop.`}
        </VerticalCutReveal>
      </div>
      <div className='mt-4 flex items-end'>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.01}
          staggerDelay={0.8}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName="text-[20px]"
        >
          {`Hi, I'm Freewin Dias!`}
        </VerticalCutReveal>
        <div className='mb-1'>
          <Player ref={playerRef} icon={ICON}  />
        </div>
      </div>
      <div className='mt-1 text-[19px] max-w-[975px]'>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.001}
          staggerDelay={1.0}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName="text-[19px]"
        >
          {`${age}, based in Vancouver — passionate about building immersive digital experiences. From Unreal Engine to Next.js, I transform ideas into refined, impactful solutions.`}
        </VerticalCutReveal>
      </div>
      <div className="flex gap-2 mt-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <Link href="/resume.pdf" target="_blank">
            <button className="border border-black px-5 py-2 rounded-lg cursor-pointer">
              <VerticalCutReveal
                splitBy="characters"
                staggerDuration={0.01}
                staggerDelay={1.3}
                staggerFrom="first"
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 21,
                }}
                wordLevelClassName=""
              >
                {`Resume`}
              </VerticalCutReveal>
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <Link href="https://www.linkedin.com/in/freewindias/" target="_blank" className="border border-black px-5 py-2 rounded-lg inline-block">
            <Player ref={linkedinRef} icon={Linkedin} size={24}  />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <Link href="https://github.com/freewindias" target="_blank" className="border border-black px-5 py-2 rounded-lg inline-block">
            <Player ref={githubRef} icon={Github} size={24}  />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
