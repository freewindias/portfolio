"use client";

import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";
import { audiowide } from "@/font";
import React, { useEffect, useRef } from 'react'
import { Player } from "@lordicon/react"
import { motion, useInView } from "motion/react";
import Link from "next/link"

import Map from "@/public/heroIcons/map.json"
import Mail from "@/public/heroIcons/mail.json"
import Linkedin from "@/public/heroIcons/linkedin.json"
import Github from "@/public/heroIcons/github.json"

export default function Contact() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const mapRef = useRef<Player>(null);
  const mailRef = useRef<Player>(null);
  const linkedinRef = useRef<Player>(null);
  const githubRef = useRef<Player>(null);

  useEffect(() => {
    if (isInView) {
      const timers = [
        setTimeout(() => mapRef.current?.playFromBeginning(), 400),
        setTimeout(() => mailRef.current?.playFromBeginning(), 600),
        setTimeout(() => linkedinRef.current?.playFromBeginning(), 800),
        setTimeout(() => githubRef.current?.playFromBeginning(), 1000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView]);

  const contactItems = [
    { icon: Map, ref: mapRef, text: "Vancouver, BC", delay: 0.1 },
    { icon: Mail, ref: mailRef, text: "diasfreewin6@gmail.com", href: "mailto:diasfreewin6@gmail.com", delay: 0.2 },
    { icon: Linkedin, ref: linkedinRef, text: "Linkedin", href: "https://www.linkedin.com/in/freewindias/", delay: 0.3 },
    { icon: Github, ref: githubRef, text: "Github", href: "https://github.com/freewindias", delay: 0.4 },
  ];

  return (
    <section ref={containerRef} className="h-full mt-20 flex flex-col items-center justify-center">
      <div className="w-full flex justify-start mb-12">
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerDelay={0}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName={`${audiowide.className} text-[35px] md:text-7xl lg:text-[110px] tracking-tighter`}
        >
          {`Contact Me`}
        </VerticalCutReveal>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border border-black rounded-2xl p-4 md:p-6 max-w-lg w-full bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center shrink-0">
                <Player 
                  ref={item.ref} 
                  icon={item.icon} 
                  size={28}
                />
              </div>
              <div className="text-xl md:text-2xl">
                {isInView && (
                  item.href ? (
                    <Link 
                      href={item.href} 
                      target={item.href.startsWith('http') ? "_blank" : undefined}
                      className="hover:underline"
                    >
                      <VerticalCutReveal
                        splitBy="characters"
                        staggerDuration={0.01}
                        staggerDelay={item.delay}
                        staggerFrom="first"
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 21,
                          delay: item.delay
                        }}
                      >
                        {item.text}
                      </VerticalCutReveal>
                    </Link>
                  ) : (
                    <VerticalCutReveal
                      splitBy="characters"
                      staggerDuration={0.01}
                      staggerDelay={item.delay}
                      staggerFrom="first"
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 21,
                        delay: item.delay
                      }}
                    >
                      {item.text}
                    </VerticalCutReveal>
                  )
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <Link href="/resume.pdf" target="_blank">
                <button className="border border-black px-8 py-3 rounded-lg cursor-pointer">
                  {isInView && (
                    <VerticalCutReveal
                      splitBy="characters"
                      staggerDuration={0.01}
                      staggerDelay={0.4}
                      staggerFrom="first"
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 21,
                        delay: 0.4
                      }}
                      wordLevelClassName="text-lg md:text-xl font-medium"
                    >
                      {`Resume`}  
                    </VerticalCutReveal>
                  )}
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
