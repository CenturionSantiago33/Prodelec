"use client";

import { MapPin, Navigation, Clock, Phone, Mail } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function UbicacionPage() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);

  // Link directo al mapa proveído por el usuario
  const MAP_URL = "https://maps.app.goo.gl/RRVMFfakNPZBZXU68";

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px] font-sans flex flex-col">
      {/* Header */}
      <div className="bg-navy-950 py-16 lg:py-24 border-b border-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-electric font-extrabold uppercase tracking-widest text-sm mb-4 block">
              Sede Central
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 drop-shadow-lg">
              {t("navLocation")}
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Vení a conocer nuestra planta de inyección robótica y oficinas comerciales. Estamos estratégicamente ubicados para garantizar una logística ágil a todo el país.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Tarjeta de Información */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/60 border border-gray-100 flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 opacity-50" />
            
            <h2 className="text-2xl font-bold text-navy-950 mb-8 border-b border-gray-100 pb-4">
              Información de Contacto
            </h2>

            <div className="space-y-8 flex-1">
              <div className="flex gap-4 group">
                <div className="mt-1 h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-sky-50 group-hover:bg-electric/10 group-hover:text-electric transition-colors">
                  <MapPin className="h-6 w-6 text-primary-600 group-hover:text-electric transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Dirección</h3>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    Parque Industrial Good Park<br />
                    Florencio Varela, Provincia de Buenos Aires
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="mt-1 h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-sky-50 group-hover:bg-electric/10 group-hover:text-electric transition-colors">
                  <Clock className="h-6 w-6 text-primary-600 group-hover:text-electric transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t("contactHours")}</h3>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    Lunes a Viernes<br />
                    08:00 hs a 17:00 hs
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="mt-1 h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-sky-50 group-hover:bg-electric/10 group-hover:text-electric transition-colors">
                  <Phone className="h-6 w-6 text-primary-600 group-hover:text-electric transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Teléfono & WhatsApp</h3>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    <strong className="text-navy-950">+54 9 11 3912-2763</strong> (Ventas)<br />
                    <span className="text-xs text-gray-500">(54-11) 2341-3935 (Planta Industrial)</span>
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-8 h-14 text-base font-bold tracking-wide rounded-xl shadow-lg hover:-translate-y-1 transition-all"
              onClick={() => window.open(MAP_URL, '_blank')}
            >
              <Navigation className="mr-2 h-5 w-5" />
              Abrir en Google Maps
            </Button>
          </motion.div>

          {/* Mapa Interactivo */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 relative h-[500px] lg:h-auto min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer"
            onClick={() => window.open(MAP_URL, '_blank')}
          >
            {/* Overlay para hacer clic e ir a Maps */}
            <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/20 transition-colors duration-500 z-10 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
              <div className="bg-white px-8 py-4 rounded-full font-bold text-primary-600 shadow-2xl flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <MapPin className="h-6 w-6" />
                Ver en Google Maps
              </div>
            </div>

            {/* Iframe del mapa con las coordenadas proporcionadas */}
            <iframe 
              src="https://maps.google.com/maps?q=-34.788779,-58.247610&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full object-cover scale-[1.02] pointer-events-none"
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
