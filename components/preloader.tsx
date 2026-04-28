"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showText, setShowText] = useState(false);
  const [startFilling, setStartFilling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);

  useEffect(() => {
    // Update time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Vancouver",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const timeStr = new Intl.DateTimeFormat("en-US", options).format(now);
      const [time, period] = timeStr.split(" ");
      const formattedTime = time.replace(":", ".") + " " + period;
      setCurrentTime(formattedTime);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Sequence
    const textTimeout = setTimeout(() => setShowText(true), 400);

    const startProgressTimeout = setTimeout(() => {
      setStartFilling(true);
      
      // 1. Wait for filling to finish (2.2s duration)
      // 2. Remove rounded corners to snap to edges
      setTimeout(() => setIsExpanded(true), 2200);
      
      // 3. After a brief pause, split the screen
      setTimeout(() => setIsSplitting(true), 2600);
      
      // 4. Finally unmount
      setTimeout(() => setIsLoaded(true), 4200);
    }, 1200); // Give the track time to scale in before filling

    return () => {
      clearInterval(timeInterval);
      clearTimeout(textTimeout);
      clearTimeout(startProgressTimeout);
    };
  }, []);

  // Premium, buttery-smooth ease
  const premiumEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

  return (
    <AnimatePresence>
      {!isLoaded && (
        <div className="fixed inset-0 z-9999 pointer-events-none flex flex-col">
          {/* Top Half */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isSplitting ? "-100%" : 0 }}
            transition={{ duration: 1.4, ease: premiumEase }}
            className="relative w-full h-[50vh] bg-white flex flex-col justify-end items-center pointer-events-auto"
          >
            {/* Upper Text */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: showText ? 0 : "100%" }}
                transition={{ 
                  duration: 1.2, 
                  ease: premiumEase
                }}
                className="text-[35px] font-normal tracking-tight text-black"
              >
                Freewin Dias's Portfolio
              </motion.h1>
            </div>
          </motion.div>

          {/* Progress Bar Container positioned at the seam */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-center z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scaleX: 0, width: "100%", borderRadius: "9999px" }}
              animate={{ 
                opacity: isSplitting ? 0 : 1, 
                scaleX: 1, 
                width: "100%",
                scaleY: isSplitting ? 0 : 1,
                borderRadius: isExpanded ? "0px" : "9999px"
              }}
              transition={{ 
                opacity: { duration: 0.8, ease: premiumEase },
                scaleX: { duration: 1.4, ease: premiumEase },
                scaleY: { duration: 0.8, ease: premiumEase },
                borderRadius: { duration: 0.4 }
              }}
              className="relative h-[5px] bg-gray-100 overflow-hidden origin-center"
            >
              {/* Filling Progress Bar (starts from middle) */}
              <motion.div
                className="absolute top-0 left-1/2 h-full bg-black rounded-full -translate-x-1/2"
                initial={{ width: "0%" }}
                animate={{ width: startFilling ? "100%" : "0%" }}
                transition={{ duration: 2.2, ease: premiumEase }}
              />
            </motion.div>
          </div>

          {/* Bottom Half */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isSplitting ? "100%" : 0 }}
            transition={{ duration: 1.4, ease: premiumEase }}
            className="relative w-full h-[50vh] bg-white flex flex-col justify-start items-center pointer-events-auto"
          >
            {/* Lower Text */}
            <div className="overflow-hidden mt-4">
              <motion.p
                initial={{ y: "-100%" }}
                animate={{ y: showText ? 0 : "-100%" }}
                transition={{ 
                  duration: 1.2, 
                  ease: premiumEase
                }}
                className="text-[17px] font-normal text-black opacity-80"
              >
                Vancouver Time: {currentTime || "00.00 AM"}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
