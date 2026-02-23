import { motion, useAnimate } from "motion/react";
import { MouseEvent } from "react";
import { IconType } from "react-icons";
import {
    SiCplusplus, SiFigma, SiGithub, SiNextdotjs, SiUnrealengine
} from "react-icons/si";

const ConvexIcon = ({ className }: { className?: string }) => (
  <svg
    width="184"
    height="188"
    viewBox="0 0 184 188"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: "auto", height: "1em" }}
  >
    <path
      d="M108.092 130.021C126.258 128.003 143.385 118.323 152.815 102.167C148.349 142.128 104.653 167.385 68.9858 151.878C65.6992 150.453 62.8702 148.082 60.9288 145.034C52.9134 132.448 50.2786 116.433 54.0644 101.899C64.881 120.567 86.8748 132.01 108.092 130.021Z"
      fill="currentColor"
    />
    <path
      d="M53.4012 90.1735C46.0375 107.19 45.7186 127.114 54.7463 143.51C22.9759 119.608 23.3226 68.4578 54.358 44.7949C57.2286 42.6078 60.64 41.3096 64.2178 41.1121C78.9312 40.336 93.8804 46.0225 104.364 56.6193C83.0637 56.8309 62.318 70.4756 53.4012 90.1735Z"
      fill="currentColor"
    />
    <path
      d="M114.637 61.8552C103.89 46.8701 87.0686 36.6684 68.6387 36.358C104.264 20.1876 148.085 46.4045 152.856 85.1654C153.3 88.7635 152.717 92.4322 151.122 95.6775C144.466 109.195 132.124 119.679 117.702 123.559C128.269 103.96 126.965 80.0151 114.637 61.8552Z"
      fill="currentColor"
    />
  </svg>
);


export default function ClipPathLinks() {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        viewport={{ once: true, margin: "-100px" }}
      className="divide-y divide-neutral-900 border border-neutral-900">
      <div className="grid grid-cols-2 divide-x divide-neutral-900">
        <LinkBox Icon={SiUnrealengine} label="Unreal Engine (Game Development)" />
        <LinkBox Icon={SiNextdotjs} label="Next.js (Web Development)" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-neutral-900">
        <LinkBox Icon={SiCplusplus} label="C++ (Game Development)" />
        <LinkBox Icon={SiGithub} label="GitHub (Version Control)" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-neutral-900">
        <LinkBox Icon={ConvexIcon} label="Convex (Backend for Web Development)" />
        <LinkBox Icon={SiFigma} label="Figma (UI/UX Design)" />
      </div>
    </motion.div>
  );
}

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

type Side = "top" | "left" | "bottom" | "right";
type KeyframeMap = {
  [key in Side]: string[];
};

const ENTRANCE_KEYFRAMES: KeyframeMap = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: KeyframeMap = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ Icon, label }: { Icon: IconType; label: string }) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e: MouseEvent) => {
    const box = (e.target as HTMLElement).getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left" as Side,
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right" as Side,
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top" as Side,
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom" as Side,
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e: MouseEvent) => {
    const side = getNearestSide(e);

    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const side = getNearestSide(e);

    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <button
      onMouseEnter={(e) => {
        handleMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave(e);
      }}
      className="relative grid h-20 w-full place-content-center sm:h-28 md:h-36"
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="text-xl sm:text-3xl lg:text-4xl" />
        <span className="text-xs font-medium sm:text-sm">{label}</span>
      </div>

      <div
        ref={scope}
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
        }}
        className="absolute inset-0 grid place-content-center bg-neutral-900 text-white"
      >
        <div className="flex flex-col items-center gap-2">
          <Icon className="text-xl sm:text-3xl md:text-4xl" />
          <span className="text-xs font-medium sm:text-sm">{label}</span>
        </div>
      </div>
    </button>
  );
};