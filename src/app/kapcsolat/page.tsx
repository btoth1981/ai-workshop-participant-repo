import type { Metadata } from "next";

import { contact } from "@/lib/content";

// Contact page (spec S6, F5, scenario F2): static contact details rendered
// from the typed content module.

export const metadata: Metadata = {
  title: "Kapcsolat",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">Kapcsolat</h1>
      <p className="max-w-prose text-muted-foreground">
        Kérdésed van egy termékről vagy a rendelésedről? Ügyfélszolgálatunk
        szívesen segít.
      </p>
      <address className="not-italic">
        <dl className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt className="font-medium">E-mail:</dt>
            <dd>
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt className="font-medium">Telefon:</dt>
            <dd>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="hover:underline"
              >
                {contact.phone}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt className="font-medium">Nyitvatartás:</dt>
            <dd>{contact.openingHours}</dd>
          </div>
        </dl>
      </address>
    </main>
  );
}
