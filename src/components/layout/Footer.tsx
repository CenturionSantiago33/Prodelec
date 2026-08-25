"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { LogoP } from "@/components/ui/logo";
import { categories } from "@/data/mock";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

// Simple SVG social icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const WHATSAPP_NUMBER = "5491123413935";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const language = useStore(state => state.language);
  const t = useTranslation(language);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-gray-300 pt-20 pb-10">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Electric top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-10 xl:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">

          {/* Brand Col — spans 2 */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 inline-flex">
              <LogoP className="h-16 w-auto drop-shadow-lg" />
              <span className="text-3xl font-heading font-bold tracking-wider text-white">PRODELEC</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              {t("footerDesc")}
            </p>
            <p className="text-xs text-gray-500 italic">
              &ldquo;{t("tagline")}&rdquo;
            </p>

            {/* Social Icons */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t("footerFollowUs")}</p>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com/prodelec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 hover:border-transparent transition-all duration-300"
                  aria-label="Instagram de Prodelec"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/@prodelec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-red-600 hover:border-transparent transition-all duration-300"
                  aria-label="YouTube de Prodelec"
                >
                  <YoutubeIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/prodelec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-blue-700 hover:border-transparent transition-all duration-300"
                  aria-label="LinkedIn de Prodelec"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-5">{t("footerCompany")}</h4>
            <ul className="space-y-3">
              <li><Link href="/empresa" className="text-sm hover:text-accent-400 transition-colors">{t("footerOurHistory")}</Link></li>
              <li><Link href="/empresa#certificaciones" className="text-sm hover:text-accent-400 transition-colors">{t("footerCertifications")}</Link></li>
              <li><Link href="/novedades" className="text-sm hover:text-accent-400 transition-colors">{t("navNews")}</Link></li>
              <li><Link href="/equipos" className="text-sm hover:text-accent-400 transition-colors">{t("navEquipment")}</Link></li>
              <li><Link href="/contacto" className="text-sm hover:text-accent-400 transition-colors">{t("navContact")}</Link></li>
            </ul>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-5">{t("footerCatalog")}</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/productos?categoria=${category.slug}`}
                    className="text-sm hover:text-accent-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/productos" className="text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors">
                  {t("footerViewAll")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-white">{t("navContact")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 shrink-0 text-accent-400 mt-0.5" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  Colectora Au 2 N° 8190<br />
                  Parque Industrial Good Park<br />
                  Florencio Varela, Buenos Aires
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-accent-400 shrink-0" />
                <button onClick={handleWhatsApp} className="text-sm text-gray-400 hover:text-white transition-colors text-left">
                  +54 11 2341-3935
                </button>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-accent-400 shrink-0" />
                <a href="mailto:prodelec@prodelec.com.ar" className="text-sm text-gray-400 hover:text-white transition-colors">
                  prodelec@prodelec.com.ar
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="mr-3 h-5 w-5 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("footerHours")}</p>
                  <p className="text-sm text-gray-400">{t("footerHoursVal")}</p>
                </div>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300 transition-colors font-medium opacity-50 cursor-not-allowed pointer-events-none"
                  aria-disabled="true"
                  title="Próximamente disponible"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t("footerCertLink")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {currentYear} PRODELEC S.R.L. {t("footerRights")}</p>
          <p className="text-xs">Colectora Au 2 N° 8190 · Florencio Varela · Buenos Aires · Argentina</p>
        </div>
      </div>
    </footer>
  );
}
