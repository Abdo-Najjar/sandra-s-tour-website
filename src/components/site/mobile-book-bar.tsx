"use client";

import { useEffect, useState } from "react";

// Phones only: a bar pinned to the bottom of a tour page with the price and a
// "Book" button that jumps to the booking form. It stays hidden at the top of
// the page and while the booking form itself is on screen.
export function MobileBookBar({ price, perPerson, label }: { price: string; perPerson: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const card = document.getElementById("booking-card");
    let cardVisible = false;
    const update = () => setShow(window.scrollY > 600 && !cardVisible);
    const io = card
      ? new IntersectionObserver(([e]) => {
          cardVisible = e.isIntersecting;
          update();
        })
      : null;
    if (card) io!.observe(card);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-book-bar", show);
    return () => document.body.classList.remove("has-book-bar");
  }, [show]);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-surface-container-high bg-surface/95 px-margin-mobile pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(21,36,61,0.08)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="leading-tight">
          <span className="font-display text-headline-sm font-bold text-primary">{price}</span>
          <span className="text-body-sm text-on-surface-variant"> {perPerson}</span>
        </div>
        <a
          href="#booking-card"
          tabIndex={show ? 0 : -1}
          className="rounded-lg bg-primary px-space-lg py-3 text-label-lg font-semibold text-white shadow-md hover:bg-primary-light"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
