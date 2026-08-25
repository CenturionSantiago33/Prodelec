"use client";

import { motion } from "framer-motion";
import { PenTool, Factory, ShieldCheck, Truck, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

const getDepartments = (t: any) => [
  {
    id: "ingenieria",
    name: t("equipDept1Name"),
    desc: t("equipDept1Desc"),
    icon: PenTool,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop", // Stock técnico/ingeniería
    skills: [t("equipDept1Skill1"), t("equipDept1Skill2"), t("equipDept1Skill3")],
  },
  {
    id: "produccion",
    name: t("equipDept2Name"),
    desc: t("equipDept2Desc"),
    icon: Factory,
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop", // Stock planta inyección
    skills: [t("equipDept2Skill1"), t("equipDept2Skill2"), t("equipDept2Skill3")],
  },
  {
    id: "calidad",
    name: t("equipDept3Name"),
    desc: t("equipDept3Desc"),
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", // Stock laboratorio industrial
    skills: [t("equipDept3Skill1"), t("equipDept3Skill2"), t("equipDept3Skill3")],
  },
  {
    id: "logistica",
    name: t("equipDept4Name"),
    desc: t("equipDept4Desc"),
    icon: Truck,
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c508b0?q=80&w=800&auto=format&fit=crop", // Stock depósito/logística
    skills: [t("equipDept4Skill1"), t("equipDept4Skill2"), t("equipDept4Skill3")],
  },
  {
    id: "ventas",
    name: t("equipDept5Name"),
    desc: t("equipDept5Desc"),
    icon: Users,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop", // Stock equipo reunión/oficina
    skills: [t("equipDept5Skill1"), t("equipDept5Skill2"), t("equipDept5Skill3")],
  },
];

export default function EquiposPage() {
  const language = useStore(state => state.language);
  const t = useTranslation(language);
  const DEPARTMENTS = getDepartments(t);

  return (
    <div className="min-h-screen bg-white pt-[80px] font-sans overflow-hidden">
      
      {/* ── HERO CORPORATIVO ── */}
      <div className="relative bg-navy-950 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary-600/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-electric bg-electric/10 border border-electric/20 uppercase tracking-widest mb-6">
              {t("equipHeroSubtitle")}
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 tracking-tight">
              {t("equipHeroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("equipHeroDesc")}
            </p>
          </motion.div>
        </div>

        {/* Separador de Ola invertida hacia blanco */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 h-16">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full fill-white">
            <path d="M0,80 L1440,80 L1440,40 C1260,60 1080,20 720,40 C360,60 180,20 0,40 Z" />
          </svg>
        </div>
      </div>

      {/* ── DEPARTAMENTOS (LISTA ALTERNADA) ── */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">
          {DEPARTMENTS.map((dept, index) => {
            const Icon = dept.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isEven ? "" : "lg:flex-row-reverse"}`}
              >
                {/* Imagen */}
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors z-10 duration-700" />
                    <img 
                      src={dept.image} 
                      alt={dept.name}
                      className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Elemento decorativo sobre la imagen */}
                    <div className={`absolute bottom-6 ${isEven ? "right-6" : "left-6"} z-20 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3`}>
                      <Icon className="h-10 w-10 text-primary-600" />
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="w-full lg:w-1/2">
                  <div className="inline-flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-sm mb-4">
                    <Icon className="h-4 w-4" /> {t("equipDeptTag")}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-navy-950 mb-6 leading-tight">
                    {dept.name}
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-8">
                    {dept.desc}
                  </p>
                  
                  {/* Skills/Tags */}
                  <div className="space-y-3">
                    {dept.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-3 text-navy-950 font-semibold">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary-600" />
                        </div>
                        {skill}
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Link href="/contacto" className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors group">
                      {t("equipContactDept")} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SECCIÓN DE CULTURA / VALORES ── */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-950 mb-6">
              {t("equipCultureTitle")}
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              {t("equipCultureDesc")}
            </p>
            <Link
              href="/empresa"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-navy-950 text-white font-bold hover:bg-primary-600 transition-all shadow-lg hover:-translate-y-1"
            >
              {t("equipCultureBtn")} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
