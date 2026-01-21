"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#work" },
    { name: "Experience", href: "/#experience" },
    { name: "Education", href: "/#education" },
    { name: "TechStack", href: "/#techstack" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a section link and we are on the homepage
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const element = document.getElementById(targetId);
      if (element && lenis) {
        lenis.scrollTo(element, { 
          offset: -80, // Offset for navbar height
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
      setIsOpen(false);
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 cubic-bezier(0.68, -0.55, 0.27, 1.55) transform-gpu ${
        isVisible ? "top-4 opacity-100" : "-top-20 opacity-0"
      }`}
    >
      <div 
        className={`bg-neutral-200/60 backdrop-blur-xl rounded-full flex items-center shadow-sm transition-all duration-700 ease-in-out transform-gpu w-[95vw] md:w-auto justify-between md:justify-center md:gap-8 md:px-6 py-2 md:py-1 px-2`}
      >
        {/* Desktop Left Items */}
        <div
          className={`hidden md:flex items-center gap-8 overflow-hidden transition-all duration-700 ease-in-out max-w-[1000px] opacity-100`}
        >
          {navItems.slice(0, 3).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-medium text-black/80 hover:text-black transition-colors whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Logo Placeholder */}
        <Link href="/" onClick={(e) => handleNavClick(e, "/")}>
          <div className="w-10 h-10 shadow-sm shrink-0 rounded-full overflow-hidden relative z-10 block cursor-pointer">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Link>

        {/* Desktop Right Items */}
        <div
          className={`hidden md:flex items-center gap-8 overflow-hidden transition-all duration-700 ease-in-out max-w-[1000px] opacity-100`}
        >
          {navItems.slice(3).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-medium text-black/80 hover:text-black transition-colors whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out w-auto opacity-100`}>
            <button
            className="p-1 text-black/80 transition-transform duration-300 ease-in-out"
            onClick={() => setIsOpen(!isOpen)}
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col gap-4 items-center md:hidden border border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg font-medium text-gray-800"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
