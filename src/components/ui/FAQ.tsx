"use client";

import { useState } from "react";

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-b border-mist">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-body font-medium text-ink">{item.question}</span>
              <span
                className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center font-display text-body text-ink transition-transform"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="animate-fade-in pb-4">
                <p className="font-display text-body-sm leading-relaxed text-smoke">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
