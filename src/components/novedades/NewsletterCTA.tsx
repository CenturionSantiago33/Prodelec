"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";

export function NewsletterCTA() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-navy-950 rounded-2xl p-8 md:p-12 overflow-hidden shadow-xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white mb-4 border border-white/10">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-2 leading-tight uppercase tracking-wider">
                {t("newsNewsletterTitle")}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto md:mx-0">
                {t("newsNewsletterDesc")}
              </p>
            </div>

            <div className="w-full md:w-[380px] shrink-0">
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t("newsNewsletterPlaceholder")}
                  className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-primary-400"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-navy-950 font-bold px-4 rounded-lg hover:bg-primary-500 hover:text-white transition-colors text-xs uppercase tracking-wider"
                >
                  {t("newsNewsletterBtn")}
                </button>
              </form>
              <p className="text-[11px] text-gray-400 mt-2 text-center md:text-left">
                {t("newsNewsletterPrivacy")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
