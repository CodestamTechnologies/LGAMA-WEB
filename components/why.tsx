"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { featuresData } from "@/lib/data";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";

export default function Why() {
  const { ref } = useSectionInView("Why", 0.5);

  return (
    <section ref={ref} id="why" className="scroll-mt-28 mb-28">
      <SectionHeading>Why LGAMA?</SectionHeading>
      
      <div>
        {featuresData.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
