"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n";

const contactSchema = z.object({
  name: z.string().min(2, "Por favor ingrese su nombre / Name required"),
  company: z.string().optional(),
  email: z.string().email("Correo electrónico inválido / Invalid email"),
  phone: z.string().min(6, "Teléfono requerido / Phone required"),
  type: z.string().min(1, "Seleccione un área / Select department"),
  message: z.string().min(10, "Mensaje mínimo 10 caracteres / Minimum 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactoPage() {
  const language = useStore((state) => state.language);
  const t = useTranslation(language);

  const [submittedSubject, setSubmittedSubject] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [isSendingDirect, setIsSendingDirect] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const selectedArea = watch("type");

  const getSubjectForArea = (area: string, name: string, company?: string) => {
    const compText = company ? ` (${company})` : "";
    return `[PRODELEC - ${area.toUpperCase()}] ${name}${compText}`;
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSendingDirect(true);
    const dynamicSubject = getSubjectForArea(data.type, data.name, data.company);
    setSubmittedSubject(dynamicSubject);
    const ref = `PROD-${Math.floor(10000 + Math.random() * 90000)}`;
    setRefNumber(ref);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSendingDirect(false);
    setSendSuccess(true);
  };

  const handleSendAnother = () => {
    setSendSuccess(false);
    reset();
  };

  const areas = [
    { value: "Ventas", label: t("contactAreaSales") },
    { value: "Compras", label: t("contactAreaPurchasing") },
    { value: "Logística", label: t("contactAreaLogistics") },
    { value: "Finanzas", label: t("contactAreaFinance") },
    { value: "Cobranzas", label: t("contactAreaCollections") },
    { value: "Pago a proveedores", label: t("contactAreaSuppliers") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] font-sans text-slate-900">
      
      {/* Header */}
      <div className="bg-navy-950 text-white border-b border-navy-900 py-12 lg:py-16">
        <div className="text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-xs font-bold text-accent-400 uppercase tracking-widest mb-3">
            {t("navContact")}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase tracking-tight mb-4">
            {t("contactHeroTitle")}
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {t("contactHeroDesc")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Info & Map */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-navy-950 mb-6 uppercase tracking-wider">
              {t("contactTitle")}
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("contactPhone")}</h3>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <a
                      href="https://wa.me/5491139122763"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-navy-950 hover:text-emerald-600 transition-colors inline-flex items-center gap-2"
                    >
                      +54 9 11 3912-2763
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        WhatsApp Ventas
                      </span>
                    </a>
                    <span className="text-xs text-slate-500">(54-11) 2341-3935 (Planta Industrial)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">E-mail</h3>
                  <p className="text-sm font-semibold text-navy-950">prodelec@prodelec.com.ar</p>
                </div>
              </div>

              <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("contactHours")}</h3>
                  <p className="text-sm font-semibold text-navy-950">
                    {t("footerHoursVal")}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Highlight */}
            <div
              className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 h-[280px] relative group cursor-pointer shadow-xs"
              onClick={() => window.open('https://maps.app.goo.gl/RRVMFfakNPZBZXU68', '_blank')}
            >
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 font-bold text-xs uppercase tracking-wider text-slate-900 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:text-primary-600 border border-slate-200">
                  <MapPin className="mr-2 h-4 w-4 text-primary-600" />
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
                className="pointer-events-none scale-105"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold font-heading text-navy-950 uppercase tracking-wider">
                {t("contactFormTitle")}
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Direct Web
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              {t("contactHeroDesc")}
            </p>
            
            {sendSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 text-emerald-950 p-6 rounded-xl border border-emerald-300 text-center space-y-4 shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-950 mb-1">
                    {t("contactSuccessTitle")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto mb-4">
                    {t("contactSuccessMsg")}
                  </p>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-left space-y-1.5 mb-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Asunto / Subject:
                      </span>
                      <span className="font-mono font-bold text-navy-950 block">
                        {submittedSubject}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[11px]">
                      <span className="text-slate-500">Ref:</span>
                      <span className="font-mono font-bold text-primary-600">{refNumber}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-navy-950 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs py-3"
                  onClick={handleSendAnother}
                >
                  {t("contactAnotherMsg")}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelName")} *</label>
                    <Input {...register("name")} className={errors.name ? "border-red-500" : "border-slate-300"} />
                    {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelCompany")}</label>
                    <Input {...register("company")} className="border-slate-300" placeholder="Ej: Sanitaria S.A." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-950 uppercase">Email *</label>
                    <Input type="email" {...register("email")} className={errors.email ? "border-red-500" : "border-slate-300"} />
                    {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelPhone")} *</label>
                    <Input type="tel" {...register("phone")} className={errors.phone ? "border-red-500" : "border-slate-300"} />
                    {errors.phone && <p className="text-[11px] text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelArea")} *</label>
                  <select 
                    {...register("type")} 
                    className={`flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${errors.type ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <option value="">{t("contactSelectOption")}</option>
                    {areas.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-[11px] text-red-500">{errors.type.message}</p>}

                  {selectedArea && (
                    <div className="mt-2 p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-[11px]">
                      <span className="font-bold text-slate-500 uppercase block text-[9px] mb-0.5">Asunto oficial / Official Subject:</span>
                      <span className="font-mono font-bold text-primary-700">
                        {getSubjectForArea(selectedArea, watch("name") || "Cliente", watch("company"))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelMsg")} *</label>
                  <textarea 
                    {...register("message")}
                    rows={4}
                    placeholder="Detallá tu consulta o requerimiento técnico..."
                    className={`flex w-full rounded-xl border bg-white p-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 resize-none ${errors.message ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  {errors.message && <p className="text-[11px] text-red-500">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-navy-950 hover:bg-primary-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  disabled={isSendingDirect}
                >
                  {isSendingDirect ? (
                    <span>{t("common.loading")}</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("contactSubmitBtn")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
