"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock, ExternalLink, ArrowRight } from "lucide-react";
import { categories } from "@/data/mock";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

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

const WHATSAPP_NUMBER = "5491139122763";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const language = useStore(state => state.language);
  const t = useTranslation(language);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <footer className="bg-navy-950 text-gray-400" style={{ borderTop: "3px solid #1a65b5" }}>

      {/* Main content */}
      <div className="container-corp py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* Brand — 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/logo-clean.png" alt="Prodelec" className="h-12 w-auto object-contain" />
              <span className="font-heading font-extrabold text-2xl tracking-widest text-white">
                PRODELEC
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              {t("footerDesc")}
            </p>

            <p className="text-xs text-gray-500 italic border-l-2 border-primary-700 pl-3">
              &ldquo;{t("tagline")}&rdquo;
            </p>

            {/* Certificación */}
            <a
              href="/certificados/PRODELEC-SRL-ISO-9001-2015.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors border border-navy-700 px-3 py-2"
            >
              <ExternalLink className="h-3.5 w-3.5 text-accent-400 shrink-0" />
              <span>Certificación ISO 9001:2015</span>
            </a>

            {/* Social */}
            <div className="flex gap-3 pt-1">
              <a
                href="https://instagram.com/prodelec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-navy-700 text-gray-500 hover:text-white hover:border-gray-500 transition-all"
                aria-label="Instagram de Prodelec"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@prodelec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-navy-700 text-gray-500 hover:text-white hover:border-gray-500 transition-all"
                aria-label="YouTube de Prodelec"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/prodelec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-navy-700 text-gray-500 hover:text-white hover:border-gray-500 transition-all"
                aria-label="LinkedIn de Prodelec"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Empresa — 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5 pb-2"
                style={{ borderBottom: "1px solid rgba(26,101,181,0.4)" }}>
              {t("footerCompany")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/empresa" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-600 inline-block shrink-0" />
                  {t("footerOurHistory")}
                </Link>
              </li>
              <li>
                <Link href="/empresa#certificaciones" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-600 inline-block shrink-0" />
                  {t("footerCertifications")}
                </Link>
              </li>
              <li>
                <Link href="/novedades" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-600 inline-block shrink-0" />
                  {t("navNews")}
                </Link>
              </li>
              <li>
                <Link href="/equipos" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-600 inline-block shrink-0" />
                  {t("navEquipment")}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-600 inline-block shrink-0" />
                  {t("navContact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Catálogo — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5 pb-2"
                style={{ borderBottom: "1px solid rgba(26,101,181,0.4)" }}>
              {t("footerCatalog")}
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/productos?categoria=${category.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-primary-600 inline-block shrink-0" />
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-accent-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5 mt-2"
                >
                  {t("footerViewAll")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5 pb-2"
                style={{ borderBottom: "1px solid rgba(26,101,181,0.4)" }}>
              {t("navContact")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent-400 mt-0.5" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  Colectora Au 2 N° 8190<br />
                  Parque Industrial Good Park<br />
                  Florencio Varela, Buenos Aires
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <button
                    onClick={handleWhatsApp}
                    className="text-sm text-gray-300 hover:text-white transition-colors text-left font-medium block"
                  >
                    +54 9 11 3912-2763
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-accent-400">
                      WhatsApp Ventas
                    </span>
                  </button>
                  <p className="text-xs text-gray-500 mt-0.5">(54-11) 2341-3935 — Planta</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent-400 shrink-0" />
                <a
                  href="mailto:prodelec@prodelec.com.ar"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  prodelec@prodelec.com.ar
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    {t("footerHours")}
                  </p>
                  <p className="text-sm text-gray-400">{t("footerHoursVal")}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="container-corp py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p className="font-medium">
            © {currentYear} <span className="text-gray-400 font-bold">PRODELEC S.R.L.</span> — {t("footerRights")}
          </p>
          <p>
            Colectora Au 2 N° 8190 · Florencio Varela · Buenos Aires · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
