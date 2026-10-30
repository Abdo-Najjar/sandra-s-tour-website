import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { safeUrl } from "@/lib/site/shape";

// Small building blocks shared by the public pages.

export function Icon({ name, className = "", fill = false }: { name: string; className?: string; fill?: boolean }) {
  if (!name) return null;
  return (
    <span aria-hidden className={`material-symbols-outlined ${fill ? "icon-fill" : ""} ${className}`}>
      {name}
    </span>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-margin-mobile md:px-margin ${className}`}>{children}</div>;
}

export function Eyebrow({ icon, children, className = "" }: { icon?: string; children: ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <div
      className={`mb-space-xs inline-flex items-center gap-2 text-label-lg font-semibold tracking-wider text-antique-gold-dark uppercase ${className}`}
    >
      {icon && <Icon name={icon} className="text-[18px]" />}
      <span>{children}</span>
    </div>
  );
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-headline-xl-mobile font-semibold tracking-tight text-primary md:text-headline-xl ${className}`}>
      {children}
    </h2>
  );
}

// Text with Arabic letters gets right-to-left direction and the Arabic font.
export function hasArabic(text: string) {
  return /[؀-ۿ]/.test(text);
}

export function Ar({ children, className = "", as: Tag = "span" }: { children: string; className?: string; as?: "span" | "p" | "div" | "h2" | "h3" }) {
  if (!children) return null;
  return (
    <Tag lang="ar" dir="rtl" className={`font-arabic ${className}`}>
      {children}
    </Tag>
  );
}

// Plain text with blank-line paragraphs.
export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className} dir="auto">
            {p}
          </p>
        ))}
    </>
  );
}

export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const url = safeUrl(href);
  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return (
      <a href={url} className={className} target={url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={url} className={className}>
      {children}
    </Link>
  );
}

export function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 text-antique-gold ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" fill className="text-[18px]" />
      ))}
    </div>
  );
}

export function formatPrice(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatDay(date: string) {
  const d = new Date(date.length === 10 ? `${date}T00:00:00Z` : date.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }).format(d);
}

export function initials(name: string) {
  return name
    .replace(/^(dr\.?|chef)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// ---------- Simple markdown for posts and pages ----------
// Supports: ## / ### headings, "- " lists, "> " quotes, ![alt](src) images,
// **bold**, *italic*, [text](url) links. Everything is rendered as React
// elements, so stored text can't inject HTML.

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={i++}>{m[1]}</strong>);
    else if (m[2]) out.push(<em key={i++}>{m[2]}</em>);
    else out.push(
      <SmartLink key={i++} href={m[4]}>
        {m[3]}
      </SmartLink>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function RichText({ source, className = "" }: { source: string; className?: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return (
    <div className={`prose-site ${className}`}>
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith("### ")) return <h3 key={i} dir="auto">{inline(block.slice(4))}</h3>;
        if (block.startsWith("## ")) {
          const t = block.slice(3);
          return (
            <h2 key={i} id={headingId(t)} dir="auto">
              {inline(t)}
            </h2>
          );
        }
        const img = block.match(/^!\[(.*?)\]\((.+?)\)$/);
        if (img) {
          return (
            <figure key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeUrl(img[2], "")} alt={img[1]} loading="lazy" />
              {img[1] && <figcaption className="-mt-3 mb-6 text-body-sm text-outline italic">{img[1]}</figcaption>}
            </figure>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j} dir="auto">
                  {inline(l.trim().slice(2))}
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => l.trim().startsWith(">"))) {
          return (
            <blockquote key={i} dir="auto">
              {inline(lines.map((l) => l.trim().replace(/^>\s?/, "")).join(" "))}
            </blockquote>
          );
        }
        return (
          <p key={i} dir="auto">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// "## Heading" lines, for a table of contents.
export function headings(source: string) {
  return source
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const t = l.slice(3).trim();
      return { id: headingId(t), text: t };
    });
}
