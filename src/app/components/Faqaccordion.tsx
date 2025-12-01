"use client";

import { useState } from "react";
import {
  HelpCircle,
  CreditCard,
  Download,
  Shield,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

interface FAQQuestion {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  questions: FAQQuestion[];
}

interface FAQAccordionProps {
  categories: FAQCategory[];
}

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  CreditCard,
  Download,
  Shield,
};

export default function FAQAccordion({ categories }: FAQAccordionProps) {
  // Track which items are open: { "categoryId-questionIndex": true/false }
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemKey: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon] || HelpCircle;

        return (
          <div
            key={category.id}
            className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            {/* Category Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {category.title}
                </h2>
              </div>
            </div>

            {/* Accordion Items */}
            <div className="px-2 py-2">
              {category.questions.map((faq, index) => {
                const itemKey = `${category.id}-${index}`;
                const isOpen = openItems[itemKey] || false;

                return (
                  <div key={itemKey} className="border-b border-slate-100 last:border-b-0">
                    {/* Accordion Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleItem(itemKey)}
                      className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50 rounded-xl transition-colors duration-200"
                    >
                      <span className="font-semibold text-base text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-4 pb-4 pt-0 text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}