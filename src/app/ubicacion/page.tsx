"use client";

import { MapPin, Navigation, Clock, Phone } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function UbicacionPage() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  const MAP_URL = "https://maps.app.goo.gl/RRVMFfakNPZBZXU68";

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] font-sans flex flex-col">
      {/* Header */}
      <div className="bg-navy-950 py-16 lg:py-20 border-b border-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-accent-400 font-extrabold uppercase tracking-widest text-xs mb-3 block">
              {t("location.headquarters")}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 uppercase tracking-tight">
              {t("navLocation")}
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
              {t("location.heroDesc")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Information Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold font-heading text-navy-950 mb-6 border-b border-gray-100 pb-3 uppercase tracking-wider">
                {t("location.infoTitle")}
              </h2>

              <div className="space-y-6">
                <div className="flex gap-3.5">
                  <div className="mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-sky-50 text-primary-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {t("location.addressTitle")}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed">
                      Colectora Au 2 N° 8190<br />
                      Parque Industrial Good Park<br />
                      Florencio Varela, Buenos Aires
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-sky-50 text-primary-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {t("location.hours")}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed">
                      {t("footerHoursVal")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-sky-50 text-primary-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {t("location.phone")}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed">
                      <strong className="text-navy-950">+54 9 11 3912-2763</strong> (Ventas)<br />
                      <span className="text-xs text-gray-500">(54-11) 2341-3935 (Planta Industrial)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-8 h-12 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-xs transition-all bg-navy-950 hover:bg-primary-600 text-white"
              onClick={() => window.open(MAP_URL, '_blank')}
            >
              <Navigation className="mr-2 h-4 w-4" />
              {t("contactOpenMap")}
            </Button>
          </motion.div>

          {/* Interactive Map */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 relative h-[450px] lg:h-auto min-h-[450px] rounded-2xl overflow-hidden shadow-xs border-2 border-gray-200 group cursor-pointer"
            onClick={() => window.open(MAP_URL, '_blank')}
          >
            <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/20 transition-colors duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-primary-600 shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                <MapPin className="h-4 w-4" />
                {t("contactOpenMap")}
              </div>
            </div>

            <iframe 
              src="https://maps.google.com/maps?q=-34.788779,-58.247610&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              className="absolute inset-0 w-full h-full object-cover scale-[1.02] pointer-events-none"
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
