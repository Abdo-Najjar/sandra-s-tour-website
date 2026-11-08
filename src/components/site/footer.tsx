import type { SiteContent } from "@/lib/site/content";
import { safeUrl, whatsappLink } from "@/lib/site/shape";
import { getUi } from "@/lib/site/lang";
import { Icon, SmartLink } from "./bits";
import { NewsletterForm } from "./forms";

export async function SiteFooter({ site, extraLinks }: { site: SiteContent; extraLinks: { slug: string; title: string }[] }) {
  const { general, contact, footer } = site;
  const { t } = await getUi();
  return (
    <footer className="w-full border-t border-antique-gold/20 bg-primary pt-space-3xl pb-space-xl text-surface-container-high">
      <div className="mx-auto w-full max-w-[1280px] px-margin-mobile md:px-margin">
        <div className="mb-space-2xl grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-4">
            <div className="flex items-center gap-space-sm">
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-antique-gold/40 bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {general.logo && <img src={safeUrl(general.logo, "")} alt="" className="size-full object-contain p-0.5" />}
              </span>
              <span className="font-display text-headline-sm font-semibold text-white">{general.name}</span>
            </div>
            <p className="pe-space-lg text-body-sm text-[#c4c6cf]">
              {footer.about}
            </p>
            <div className="flex flex-wrap gap-space-sm pt-space-xs">
              {footer.badges.map((b) => (
                <span key={b.text} className="inline-flex items-center gap-1.5 rounded border border-antique-gold/30 bg-white/10 px-space-sm py-1 text-label-md text-white">
                  <Icon name={b.icon} className="text-[16px] text-antique-gold" />
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-space-sm lg:col-span-2">
            <h2 className="mb-space-xs font-sans text-headline-sm font-semibold text-antique-gold">{footer.linksTitle}</h2>
            <ul className="flex flex-col">
              {footer.links.map((l) => (
                <li key={l.label} className="text-body-sm">
                  <SmartLink href={l.href} className="inline-block py-1 text-[#c4c6cf] transition-colors hover:text-white">
                    {l.label}
                  </SmartLink>
                </li>
              ))}
              {extraLinks.map((p) => (
                <li key={p.slug} className="text-body-sm">
                  <SmartLink href={`/p/${p.slug}`} className="inline-block py-1 text-[#c4c6cf] transition-colors hover:text-white">
                    {p.title}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-space-sm lg:col-span-3">
            <h2 className="mb-space-xs font-sans text-headline-sm font-semibold text-antique-gold">{footer.officesTitle}</h2>
            <div className="flex flex-col gap-space-sm text-body-sm text-[#c4c6cf]">
              {contact.offices.map((o) => (
                <div key={o.title} className="flex items-start gap-space-sm">
                  <Icon name="location_on" className="shrink-0 text-antique-gold" />
                  <div>
                    <strong className="block text-white">{o.title}:</strong>
                    <span>{o.address}</span>
                  </div>
                </div>
              ))}
              {contact.phones && (
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <Icon name="call" className="shrink-0 text-antique-gold" />
                  <span dir="ltr">{contact.phones}</span>
                </div>
              )}
              {contact.whatsapp && (
                <a href={whatsappLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-space-sm hover:text-white">
                  <Icon name="chat" className="shrink-0 text-antique-gold" />
                  <span>
                    {t.whatsapp}: <span dir="ltr">{contact.whatsapp}</span>
                  </span>
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-space-sm break-all hover:text-white">
                  <Icon name="mail" className="shrink-0 text-antique-gold" />
                  {contact.email}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-space-md lg:col-span-3">
            <h2 className="font-sans text-headline-sm font-semibold text-antique-gold">{footer.newsletterTitle}</h2>
            <p className="text-body-sm text-[#c4c6cf]">{footer.newsletterText}</p>
            <NewsletterForm placeholder={footer.newsletterPlaceholder} button={footer.newsletterButton} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-space-md border-t border-white/10 pt-space-lg text-label-md text-[#c4c6cf] md:flex-row">
          <p className="text-center md:text-start">{footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-space-md">
            {footer.bottomLinks.map((l) => (
              <SmartLink key={l.label} href={l.href} className="inline-block py-1.5 transition-colors hover:text-antique-gold">
                {l.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton({ phone, label }: { phone: string; label: string }) {
  if (!phone) return null;
  return (
    <a
      href={whatsappLink(phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="whatsapp-fab fixed end-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.05c0-5.23 4.26-9.49 9.5-9.49a9.43 9.43 0 0 1 6.71 2.78 9.43 9.43 0 0 1 2.78 6.72c0 5.23-4.26 9.49-9.49 9.49zm8.08-17.57A11.35 11.35 0 0 0 12.04.5C5.74.5.62 5.62.62 11.92c0 2.01.53 3.98 1.53 5.71L.52 23.5l6.01-1.58a11.4 11.4 0 0 0 5.45 1.39h.01c6.3 0 11.42-5.12 11.42-11.42 0-3.05-1.19-5.92-3.29-8.08z" />
      </svg>
    </a>
  );
}
