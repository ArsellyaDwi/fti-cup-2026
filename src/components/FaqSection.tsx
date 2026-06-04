import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Faq } from "../types";

interface FaqSectionProps {
  faqs: Faq[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (!faqs || faqs.length === 0) return null;

  // Split FAQs into 2 columns for wider horizontal desktop layout
  const half = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, half);
  const rightFaqs = faqs.slice(half);

  const renderFaqCard = (faq: Faq, globalIndex: number) => {
    const isOpen = openId === faq.id;
    return (
      <div
        key={faq.id}
        id={`faq-item-${faq.id}`}
        className={`border rounded-xl transition-all duration-200 bg-white dark:bg-[#121826] ${
          isOpen
            ? "border-[#003B7A] dark:border-[#1E293B] shadow-xs"
            : "border-[#E2E8F0] dark:border-[#1E293B]/45"
        }`}
      >
        {/* Accordion Trigger */}
        <button
          id={`faq-trigger-${faq.id}`}
          onClick={() => toggleFaq(faq.id)}
          className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
          aria-expanded={isOpen}
        >
          <div className="flex-1 pr-4 text-left">
            <span className="font-sans font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-[14px] sm:text-[15px] md:text-base leading-snug">
              {faq.question}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#475569] dark:text-slate-400 transition-transform duration-250 shrink-0 ${
              isOpen ? "transform rotate-180 text-blue-600 dark:text-[#60A5FA]" : ""
            }`}
          />
        </button>

        {/* Collapsible Content */}
        <div
          id={`faq-content-${faq.id}`}
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-[1000px] border-t border-[#E2E8F0] dark:border-[#1E293B]/45 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-5 text-left bg-slate-50/50 dark:bg-[#121826]/30 rounded-b-xl">
            <div className="text-[13px] sm:text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1] space-y-2.5 font-sans font-normal">
              {faq.answer.split("\n").map((line, lineIdx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith("•")) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-1.5">
                      <span className="h-1.5 w-1.5 bg-[#003B7A] dark:bg-blue-400 rounded-full shrink-0 mt-2" />
                      <span>{trimmed.substring(1).trim()}</span>
                    </div>
                  );
                }
                return (
                  <p key={lineIdx} className={`${trimmed === "" ? "h-2" : ""}`}>
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="faq"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-[#F8FAFC] dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Tanya Jawab
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight animate-fade-in">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal leading-relaxed">
            Punya pertanyaan seputar pelaksanaan FTI CUP 2026? Temukan jawabannya di sini atau hubungi narahubung kami.
          </p>
        </div>

        {/* FAQ 2-Column Grid on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            {leftFaqs.map((faq, index) => renderFaqCard(faq, index))}
          </div>
          <div className="space-y-4">
            {rightFaqs.map((faq, index) => renderFaqCard(faq, index + half))}
          </div>
        </div>
      </div>
    </section>
  );
}
