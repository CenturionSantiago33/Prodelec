"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Zap, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";

const TIMELINE_EVENTS = [
  {
    id: 1,
    date: "10 de Agosto, 2026",
    title: "Nueva línea de cajas compactas y base abierta homologadas",
    desc: "Presentamos al mercado la evolución de nuestras cajas de conexión, con un diseño base abierta que agiliza la instalación y resiste hasta 3.000 kg de presión en obra. Ya disponible en todas las sucursales.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1610056494052-6a4f8b030e4b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    date: "25 de Julio, 2026",
    title: "Expansión de planta e incorporación de inyección robótica",
    desc: "Para asegurar un abastecimiento continuo a las grandes obras de infraestructura nacional, incorporamos dos nuevas inyectoras robóticas de alta tecnología.",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    date: "14 de Junio, 2026",
    title: "Nuevo acuerdo estratégico de distribución en Patagonia",
    desc: "Con el objetivo de acortar los tiempos de entrega, Prodelec firma una alianza clave que nos permitirá estar más cerca de las obras del sur del país.",
    icon: Target,
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
  },
];

export function NewsTimeline() {
  return (
    <section className="py-32 bg-white relative">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-navy-950 mb-4 tracking-tight">
            Últimas Novedades
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Hitos recientes, lanzamientos institucionales y noticias corporativas de Prodelec.
          </p>
        </div>

        <div className="relative">
          {/* Línea central */}
          <div className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 via-primary-300 to-transparent opacity-30" />

          <div className="space-y-16">
            {TIMELINE_EVENTS.map((event, i) => {
              const isEven = i % 2 === 0;
              const Icon = event.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Nodo central */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-[2px] md:-translate-x-1/2 top-0 md:top-8 w-14 h-14 rounded-full bg-white border-4 border-primary-100 flex items-center justify-center shadow-lg z-10">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Espaciador para desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Tarjeta */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                    <div className="bg-white rounded-3xl border border-gray-100 p-1 hover:shadow-xl transition-all duration-300">
                      <div className="rounded-2xl overflow-hidden mb-6 h-56 relative group">
                        <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors z-10" />
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 z-20 inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-navy-950 shadow-sm">
                          <Calendar className="mr-1.5 h-3.5 w-3.5 text-primary-600" />
                          {event.date}
                        </div>
                      </div>
                      
                      <div className="px-6 pb-8">
                        <h3 className="text-xl font-bold text-navy-950 mb-3 leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          {event.desc}
                        </p>
                        <Link href="#" className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors">
                          Leer artículo completo <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
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
