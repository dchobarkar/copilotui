"use client";

import Link from "next/link";

export interface PageFooterLink {
  href: string;
  label: string;
}

const DEFAULT_LINKS: PageFooterLink[] = [
  { href: "/chat", label: "← Back to chat" },
  { href: "/settings", label: "Settings" },
  { href: "/profile", label: "Profile" },
  { href: "/subscription", label: "Subscription" },
  { href: "/help", label: "Help & Support" },
];

interface PageFooterLinksProps {
  /** Links to show. Defaults to chat, settings, profile, subscription, help. */
  links?: PageFooterLink[];
  className?: string;
}

export const PageFooterLinks = ({
  links = DEFAULT_LINKS,
  className = "",
}: PageFooterLinksProps) => {
  return (
    <div
      className={`pt-6 border-t border-stone-200 dark:border-slate-700 flex flex-wrap gap-4 ${className}`}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
