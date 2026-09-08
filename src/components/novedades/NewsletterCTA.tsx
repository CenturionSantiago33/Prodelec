"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-navy-950 rounded-[2.5rem] p-10 md:p-16 overflow-hidden shadow-2xl"
        >
          {/* Fondo Decorativo */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white mb-6 backdrop-blur-md border border-white/10">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
                No te pierdas las novedades
              </h2>
              <p className="text-gray-300 text-lg max-w-md mx-auto md:mx-0">
                Recibí por correo nuevos lanzamientos, catálogos técnicos y actualizaciones normativas de Prodelec.
              </p>
            </div>

            <div className="w-full md:w-[400px] shrink-0">
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  className="w-full h-16 bg-white/5 border border-white/20 rounded-2xl px-6 text-white placeholder:text-gray-400 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-white text-navy-950 font-bold px-6 rounded-xl hover:bg-electric hover:text-navy-950 transition-colors shadow-md flex items-center gap-2 group-focus-within:bg-electric"
                >
                  Suscribirse
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center md:text-left">
                No enviamos spam. Podés desuscribirte en cualquier momento.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
