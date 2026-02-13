"use client";

import { useState } from "react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContent } from "@/components/layout/PageContent";
import { PageFooterLinks } from "@/components/layout/PageFooterLinks";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { FAQ_ITEMS } from "@/data/faq";

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <PageHeader title="Help & Support" />

      <PageContent maxWidth="2xl">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-slate-100 mb-2">
            Frequently asked questions
          </h2>
          <p className="text-sm text-stone-600 dark:text-slate-400">
            Find answers to common questions about using CopilotUI.
          </p>
        </div>

        <div className="space-y-1">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <PageFooterLinks
          links={[
            { href: "/chat", label: "← Back to chat" },
            { href: "/settings", label: "Settings" },
            { href: "/profile", label: "Profile" },
          ]}
          className="mt-8"
        />
      </PageContent>
    </>
  );
}
