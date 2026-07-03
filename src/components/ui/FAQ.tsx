"use client";

import { useState } from "react";
import { ElevatedCard } from "@/components/ui/Card";

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

export function StarRating({ rating = 5, className = "" }: { rating?: number; className?: string }) {
  return (
    <div className={`flex justify-center gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill={i < rating ? "var(--color-star)" : "var(--color-mist)"}>
          <path d="M10 1.5L12.5 7.5H19L14 11.5L16 18L10 14L4 18L6 11.5L1 7.5H7.5L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCard({
  quote,
  author,
  rating = 5,
}: {
  quote: string;
  author: string;
  rating?: number;
}) {
  return (
    <ElevatedCard className="p-8 text-center">
      <StarRating rating={rating} className="mb-6" />
      <p className="mb-6 font-display text-subheading font-semibold leading-snug text-ink">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="font-handwritten text-body text-smoke">{author}</p>
    </ElevatedCard>
  );
}
