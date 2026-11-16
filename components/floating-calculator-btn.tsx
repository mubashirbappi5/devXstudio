"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator } from "lucide-react";

export function FloatingCalculatorButton() {
  const pathname = usePathname();

  // Do not show when already viewing the calculator page or admin portal
  if (pathname === "/website-cost-calculator" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      href="/website-cost-calculator"
      className="floating-calculator-btn"
      aria-label="Wix Website Cost Calculator — Estimate your project investment"
    >
      <div className="floating-calculator-icon">
        <Calculator size={18} strokeWidth={2.4} />
        <span className="floating-calculator-ping" aria-hidden="true" />
      </div>
      <span className="floating-calculator-label">Cost Calculator</span>
    </Link>
  );
}
