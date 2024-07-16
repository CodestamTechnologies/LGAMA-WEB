import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterestP, FaTiktok, FaYelp } from "react-icons/fa";
import corpcommentImg from "@/public/corpcomment.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Why",
    hash: "#why",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;


export const experiencesData = [
  {
    title: "Instagram Contractors",
    description:
      "Find contractors showcasing their projects, perfect for construction partnerships.",
    icon: React.createElement(FaInstagram),
  },
  {
    title: "Facebook Plumbers",
    description:
      "Collect contact details of plumbers for service outreach in both residential and commercial sectors.",
    icon: React.createElement(FaFacebook),
  },
  {
    title: "Restaurant Owners on Facebook",
    description:
      "Connect with restaurant owners for promotional opportunities or supply chain marketing.",
    icon: React.createElement(FaFacebook),
  },
  {
    title: "LinkedIn Real Estate Agents",
    description:
      "Provide marketing solutions, photography, or software tailored for real estate professionals.",
    icon: React.createElement(FaLinkedin),
  },
  {
    title: "Pinterest Fashion Retailers",
    description:
      "Engage with fashion retailers, offering e-commerce solutions or marketing services.",
    icon: React.createElement(FaPinterestP),
  },
  {
    title: "Yelp Small Business Owners",
    description:
      "Deliver digital marketing, website design, or local SEO services to small business owners.",
    icon: React.createElement(FaYelp),
  },
  {
    title: "Agency Owners on LinkedIn",
    description:
      "Reach out to agency owners for partnership opportunities, marketing solutions, and industry insights.",
    icon: React.createElement(FaLinkedin),
  },
  {
    title: "Realtors on Facebook",
    description:
      "Connect with realtors to offer photography services, marketing solutions, or real estate software.",
    icon: React.createElement(FaFacebook),
  },
  {
    title: "Fashion Retailers on TikTok",
    description:
      "Target fashion retailers with e-commerce solutions, marketing services, and influencer collaborations.",
    icon: React.createElement(FaTiktok),
  },
  {
    title: "Contractors on Facebook",
    description:
      "Collect contact details of contractors for construction partnerships, project collaborations, and service outreach.",
    icon: React.createElement(FaFacebook),
  },
  {
    title: "Agencies on Instagram",
    description:
      "Identify agencies to offer collaboration opportunities, digital marketing services, and creative solutions.",
    icon: React.createElement(FaInstagram),
  },
  {
    title: "CEOs on LinkedIn",
    description:
      "Network with CEOs to provide high-level business solutions, consultancy services, and executive coaching.",
    icon: React.createElement(FaLinkedin),
  },
] as const;



export const featuresData = [
  {
    title: "Targeted Email Extraction",
    description:
      "Harness the power of targeted email extraction to optimize your outreach efforts. Enhance your marketing strategies with accurate and targeted email lists.",
    tags: ["Email Extraction", "Lead Generation", "Targeted Marketing"],
    imageUrl: corpcommentImg, // replace with actual image variable
  },
  {
    title: "Effective Campaigns",
    description:
      "Leverage extracted emails for Google Ads or Facebook campaigns to boost engagement and conversions. Craft focused campaigns using precise and relevant data.",
    tags: ["Campaigns", "Google Ads", "Facebook", "Data-Driven Marketing"],
    imageUrl: corpcommentImg, // replace with actual image variable
  },
  {
    title: "Cold Email Outreach",
    description:
      "Send tailored cold emails with compelling content to captivate your audience. Establish connections and generate leads through strategic email campaigns and persistent follow-ups.",
    tags: ["Cold Emails", "Personalized Outreach", "Lead Generation"],
    imageUrl: corpcommentImg, // replace with actual image variable
  },
  {
    title: "Multi-Platform Email Collection",
    description:
      "Gather emails from a variety of platforms including Facebook, Instagram, LinkedIn, and Twitter. Broaden your outreach and connect with a wide range of audiences across different social media and professional networks.",
    tags: ["Multi-Platform", "Email Collection", "Social Media"],
    imageUrl: corpcommentImg, // replace with actual image variable
  },
] as const;


export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Apollo",
  "Express",
  "PostgreSQL",
  "Python",
  "Django",
  "Framer Motion",
] as const;
