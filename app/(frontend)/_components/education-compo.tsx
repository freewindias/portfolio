import {
  BriefcaseBusinessIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  CodeXmlIcon,
  DraftingCompassIcon,
  GraduationCapIcon,
} from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import React from "react";


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const iconMap = {
  code: CodeXmlIcon,
  design: DraftingCompassIcon,
  business: BriefcaseBusinessIcon,
  education: GraduationCapIcon,
} as const;

/**
 * Represents the valid keys of the `iconMap` object, used to specify the type of icon
 * associated with an education position.
 */
export type educationPositionIconType = keyof typeof iconMap;

export type educationPositionItemType = {
  /** Unique identifier for the position */
  id: string;
  /** The job title or position name */
  title: string;
  /** The period during which the position was held (e.g., "Jan 2020 - Dec 2021") */
  employmentPeriod: string;
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string;
  /** A brief description of the position or responsibilities */
  description?: string;
  /** An icon representing the position */
  icon?: educationPositionIconType;
  /** A list of skills associated with the position */
  skills?: string[];
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean;
};

export type educationItemType = {
  /** Unique identifier for the education item */
  id: string;
  /** Name of the company where the education was gained */
  companyName: string;
  /** URL or path to the company's logo image */
  companyLogo?: string;
  /** List of positions held at the company */
  positions: educationPositionItemType[];
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean;
};

export function Workeducation({
  className,
  educations,
}: {
  className?: string;
  educations: educationItemType[];
}) {
  return (
    <div className={cn("bg-background", className)}>
      {educations.map((education) => (
        <EducationItem key={education.id} education={education} />
      ))}
    </div>
  );
}

export function EducationItem({
  education,
}: {
  education: educationItemType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-4 py-4"
    >
      <div className="not-prose flex items-center gap-3">
        <div
          className="flex size-6 shrink-0 items-center justify-center"
          aria-hidden
        >
          {education.companyLogo ? (
            <Image
              src={education.companyLogo}
              alt={education.companyName}
              width={24}
              height={24}
              quality={100}
              className="rounded-full"
              unoptimized
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="text-lg leading-snug font-medium text-foreground">
          {education.companyName}
        </h3>

        {education.isCurrentEmployer && (
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-green-500 opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            <span className="sr-only">Current Employer</span>
          </span>
        )}
      </div>

      <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
        {education.positions.map((position) => (
          <EducationPositionItem key={position.id} position={position} />
        ))}
      </div>
    </motion.div>
  );
}

export function EducationPositionItem({
  position,
}: {
  position: educationPositionItemType;
}) {
  const educationIcon = iconMap[position.icon || "business"];

  return (
    <Collapsible defaultOpen={position.isExpanded} asChild>
      <div className="relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background">
        <CollapsibleTrigger
          className={cn(
            "group/education not-prose block w-full text-left select-none",
            "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-muted/50"
          )}
        >
          <div className="relative z-1 mb-1 flex items-center gap-3 pl-9">
            {/* <div
              className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
              aria-hidden
            >
              <educationIcon className="size-4" />
            </div> */}

            <h4 className="flex-1 text-base font-medium text-balance text-foreground">
              {position.title}
            </h4>

            <div
              className="shrink-0 text-muted-foreground [&_svg]:size-4"
              aria-hidden
            >
              <ChevronsDownUpIcon className="hidden group-data-[state=open]/education:block" />
              <ChevronsUpDownIcon className="hidden group-data-[state=closed]/education:block" />
            </div>
          </div>

          <div className="relative z-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 pl-9 text-sm text-muted-foreground">
            {position.employmentType && (
              <>
                <dl>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </dl>
                <Separator
                  className="data-[orientation=horizontal]:w-full md:hidden"
                  orientation="horizontal"
                />
                <Separator
                  className="hidden md:block md:data-[orientation=vertical]:h-4"
                  orientation="vertical"
                />
              </>
            )}

            <dl>
              <dt className="sr-only">Employment Period</dt>
              <dd>{position.employmentPeriod}</dd>
            </dl>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {position.description && (
            <Prose className="pt-2 pl-9">
              <div dangerouslySetInnerHTML={{ __html: position.description || "" }} />
            </Prose>
          )}

          {Array.isArray(position.skills) && position.skills.length > 0 && (
            <ul className="not-prose flex flex-wrap gap-1.5 pt-2 pl-9">
              {position.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Skill>{skill}</Skill>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none font-mono text-foreground prose-zinc dark:prose-invert",
        "prose-a:font-medium prose-a:wrap-break-word prose-a:text-foreground prose-a:underline prose-a:underline-offset-4",
        "prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "prose-p:my-1 prose-ul:my-2 prose-li:my-0 prose-headings:my-2",
        className
      )}
      {...props}
    />
  );
}

function Skill({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
