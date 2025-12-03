"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from HTML content
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h2, h3");
    
    const extractedHeadings: Heading[] = [];
    elements.forEach((el, index) => {
      const id = el.id || `heading-${index}`;
      extractedHeadings.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName.charAt(1)),
      });
    });
    
    setHeadings(extractedHeadings);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-violet-600" />
        <h3 className="font-semibold text-gray-900">Table of Contents</h3>
      </div>
      
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => handleClick(heading.id)}
            className={`
              block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors
              ${heading.level === 3 ? "pl-6" : ""}
              ${
                activeId === heading.id
                  ? "bg-violet-100 text-violet-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
