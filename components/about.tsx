"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";
import { experiencesData } from "@/lib/data";
import { IconBaseProps } from "react-icons";

// Define the type for a single experience item
interface ExperienceItem {
  readonly title: string;
  readonly description: string;
  readonly icon: React.FunctionComponentElement<IconBaseProps>;
  readonly date?: string; // Make date optional if it's not always present
}

export default function About() {
  const { ref } = useSectionInView("About");
  const { theme } = useTheme();

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[60rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>What is LGAMA?</SectionHeading>
      <p className="mb-3 text-xl">
        <span className="font-medium">LGAMA</span> is tailored to collect email
        addresses available on the internet from social media platforms,
        specifically designed for cold outreach.
      </p>

      <SectionHeading>Cold outreach for collaborations and connections</SectionHeading>
      <p className="mb-3 text-lg">Examples</p>

      <Timeline experiencesData={experiencesData} theme={theme} />
    </motion.section>
  );
}

const TimelineItem: React.FC<{ item: ExperienceItem; index: number }> = ({ item, index }) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-center md:items-start mb-10 last:mb-0"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 md:mb-0 md:mr-4">
        {item.icon}
      </div>
      <div className="flex-1">
        <motion.div
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-semibold capitalize text-lg mb-2">{item.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface TimelineProps {
  experiencesData: readonly ExperienceItem[];
  theme: string;
}

const Timeline: React.FC<TimelineProps> = ({ experiencesData, theme }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {experiencesData.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} />
      ))}
    </div>
  );
};