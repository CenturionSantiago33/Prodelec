"use client";

import { motion } from "framer-motion";
import { Zap, Target, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";

export function NewsTimeline() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  const TIMELINE_EVENTS = [
    {
      id: 1,
      date: "2026",
      title: "Nueva línea de cajas compactas y base abierta homologadas",
      desc: "Presentamos la evolución de nuestras cajas de conexión, con diseño base abierta para agilizar la instalación y soportar altas exigencias en obra pública.",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1610056494052-6a4f8b030e4b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      date: "2026",
      title: "Expansión de planta e incorporación de inyección robótica",
      desc: "Para asegurar abastecimiento continuo a las grandes obras de infraestructura, sumamos celdas robotizadas en el Parque Industrial Good Park.",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      date: "2026",
      title: "Acuerdos estratégicos de distribución regional",
      desc: "Alianzas clave para optimizar los tiempos de entrega y cobertura logística en todo el territorio nacional y países limítrofes.",
      icon: Target,
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-2">
            {t("home.news.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-950 mb-3 tracking-tight uppercase">
            {t("home.news.title")}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            {t("home.news.desc")}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 via-primary-300 to-transparent opacity-30" />

          <div className="space-y-12">
            {TIMELINE_EVENTS.map((event, i) => {
              const isEven = i % 2 === 0;
              const Icon = event.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full md:w-1/2">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs">
                      <div className="flex items-center gap-2 text-primary-600 font-mono text-xs font-bold mb-2">
                        <Icon className="h-4 w-4" /> {event.date}
                      </div>
                      <h3 className="text-base font-bold font-heading text-navy-950 mb-2 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>

                  {/* Marker */}
                  <div className="absolute left-[27px] md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-primary-600 flex items-center justify-center shadow-xs z-10 hidden md:flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="h-48 rounded-2xl overflow-hidden border border-slate-200">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
