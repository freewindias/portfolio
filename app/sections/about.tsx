"use client"

import React from "react";
import { 
  SiUnrealengine, 
  SiNextdotjs, 
  SiFramer, 
  SiTailwindcss, 
  SiTypescript, 
  SiCplusplus, 
} from "react-icons/si";
import { FaReact, FaGithub } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";

const techStackBadge = [
  { name: "Unreal Engine", icon: <SiUnrealengine className="w-6 h-6" /> },
  { name: "C++", icon: <SiCplusplus className="w-6 h-6" /> },
  { name: "Next.js", icon: <SiNextdotjs className="w-6 h-6" /> },
  { name: "React.js", icon: <FaReact className="w-6 h-6" /> },
  { name: "PostgreSQL", icon: <BiLogoPostgresql className="w-6 h-6" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="w-6 h-6" /> },
  { name: "TypeScript", icon: <SiTypescript className="w-6 h-6" /> },
  { name: "Framer Motion", icon: <SiFramer className="w-6 h-6" /> },
  { name: "Github", icon: <FaGithub className="w-6 h-6" /> },
];

const AboutMe = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge("2002-12-06");

  if (!mounted) return null;

  return (
    <section>
      <div className="container">
        <div className="border-x border-border bg-[url('/images/about-me/about-me-bg.svg')] bg-cover bg-center bg-no-repeat">
          <div className="flex flex-col gap-9 sm:gap-12 max-w-3xl mx-auto px-4 sm:px-7 py-11 md:py-20">
            <div className="flex flex-col gap-4">
              <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                About Me
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px]">
                Hey there. I'm Freewin — {age}, based in Vancouver, passionate about{" "}
                <span className="bg-[linear-gradient(90deg,rgba(243,202,77,0.4)_0%,rgba(243,202,77,0.05)_100%)]">
                  building immersive digital experiences.
                </span>{" "}
                From <span className="border-violet-400 border-b-2">Unreal Engine to Next.js</span>,
                I transform ideas into refined, impactful solutions.
              </h2>
              {/* <h5 className="font-normal">
                Previously at Oak Studio, and creator of RODIAS.
              </h5> */}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1">
                {techStackBadge?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-default"
                    >
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-primary/80 group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
