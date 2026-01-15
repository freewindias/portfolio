"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { Loader2Icon } from "lucide-react";

// Types for the dynamic icon props
interface DynamicIconProps extends React.ComponentProps<"svg"> {
  name: string;
  className?: string;
}

// Cache for specific icon components to avoid re-fetching
const iconCache: Record<string, React.ComponentType | null> = {};

export const DynamicIcon: FC<DynamicIconProps> = ({ name, className, ...props }) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType | null>(
    iconCache[name] || null
  );
  
  // Extract the prefix (e.g. "Fa" from "FaReact")
  const prefix = name.substring(0, 2).toLowerCase();

  useEffect(() => {
    if (!name || iconCache[name]) return;

    let isMounted = true;

    const loadIcon = async () => {
      try {
        let iconModule;

        // Route to the correct sub-library key based on prefix
        // We use specific imports to help bundlers (though dynamic keys are tricky)
        // Note: In Next.js/Webpack, dynamic imports with template strings work best
        // if they are somewhat static. However, for react-icons, standardizing 
        // on the 2-letter prefix is the most robust way.
        
        switch (prefix) {
          case "fa": // FontAwesome
             // Check if it's Fa6
             if (name.startsWith("Fa6")) {
                iconModule = await import("react-icons/fa6");
             } else {
                iconModule = await import("react-icons/fa");
             }
             break;
          case "md": // Material Design
             iconModule = await import("react-icons/md");
             break;
          case "si": // Simple Icons
             iconModule = await import("react-icons/si");
             break;
          case "bs": // Bootstrap
             iconModule = await import("react-icons/bs");
             break;
          case "bi": // BoxIcons
             iconModule = await import("react-icons/bi");
             break;
          case "gi": // Game Icons
             iconModule = await import("react-icons/gi");
             break;
          case "lu": // Lucide (via react-icons, though we have lucide-react locally)
             iconModule = await import("react-icons/lu");
             break;
          case "tb": // Tabler
             iconModule = await import("react-icons/tb");
             break;
          case "io": // Ionicons
             if (name.startsWith("Io5")) {
                 iconModule = await import("react-icons/io5");
             } else {
                 iconModule = await import("react-icons/io");
             }
             break;
          case "ri": // Remix
             iconModule = await import("react-icons/ri");
             break;
          case "hi": // Heroicons
             if (name.startsWith("Hi2")) {
                 iconModule = await import("react-icons/hi2");
             } else {
                 iconModule = await import("react-icons/hi");
             }
             break;
          case "pi": // Phosphor
             iconModule = await import("react-icons/pi");
             break;
          case "ci": // Circum
             iconModule = await import("react-icons/ci");
            break;
          default:
            // Fallback or try to guess? For now, no generic fallback to avoid huge bundles
            console.warn(`Icon prefix '${prefix}' for '${name}' not explicitly handled.`);
            break;
        }

        if (iconModule && isMounted) {
          const Component = (iconModule as any)[name];
          if (Component) {
            iconCache[name] = Component;
            setIconComponent(() => Component);
          }
        }
      } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [name, prefix]);

  if (!IconComponent) {
    // Return a placeholder or null while loading/if not found
    // If the name is "business", "education", etc from the old hardcoded list, we might want a legacy map.
    // For now, let's assume valid react-icons names.
    return (
        <span className={`inline-block bg-muted/20 animate-pulse rounded-md ${className}`} style={{ width: '1em', height: '1em' }} />
    );
  }

  return (
    <IconContext.Provider value={{ className: className, ...props }}>
      <IconComponent />
    </IconContext.Provider>
  );
};
