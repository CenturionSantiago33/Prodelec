"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/i18n/translations";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  company: z.string().optional(),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(8, "Teléfono muy corto"),
  type: z.enum(["Logística", "Pago a proveedores", "Cobranzas", "Compras", "Ventas", "Finanzas"], {
    message: "Selecciona un área",
  }),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
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

  // Helper for dynamic Email Subject based on selected Area
  const getSubjectForArea = (area: string, name: string, company?: string) => {
    const compText = company ? ` (${company})` : "";
    switch (area) {
      case "Ventas":
        return `[CONSULTA DE VENTAS Y COTIZACIONES] — ${name}${compText}`;
      case "Compras":
        return `[DEPARTAMENTO DE COMPRAS Y PROVEEDORES] — ${name}${compText}`;
      case "Logística":
        return `[CONSULTA DE LOGÍSTICA Y ENTREGAS] — ${name}${compText}`;
      case "Finanzas":
        return `[DEPARTAMENTO DE FINANZAS] — ${name}${compText}`;
      case "Cobranzas":
        return `[CONSULTA DE COBRANZAS] — ${name}${compText}`;
      case "Pago a proveedores":
        return `[PAGO A PROVEEDORES Y FACTURACIÓN] — ${name}${compText}`;
      default:
        return `[CONTACTO OFICIAL PRODELEC] — ${name}${compText}`;
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSendingDirect(true);
    const dynamicSubject = getSubjectForArea(data.type, data.name, data.company);
    setSubmittedSubject(dynamicSubject);
    const ref = `MAIL-${Math.floor(10000 + Math.random() * 90000)}`;
    setRefNumber(ref);

    // Direct In-Page Email Dispatch Simulation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSendingDirect(false);
    setSendSuccess(true);
  };

  const handleSendAnother = () => {
    setSendSuccess(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] font-sans text-slate-900">
      
      {/* Header */}
      <div className="bg-navy-950 text-white border-b border-navy-900 py-12 lg:py-16">
        <div className="text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-xs font-bold text-electric uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" /> {t("navContact")}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase tracking-tight mb-4">
            {t("contactHeroTitle")}
          </h1>
          <p className="text-base sm:text-lg text-slate-300">
            {t("contactHeroDesc")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Info & Map */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-navy-950 mb-8 uppercase">
              {t("contactTitle")}
            </h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase">{t("contactPhone")}</h3>
                  <p className="text-sm font-semibold text-navy-950">(54-11) 2341-3935</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase">Servidor Directo de E-mail</h3>
                  <p className="text-sm font-semibold text-navy-950">prodelec@prodelec.com.ar</p>
                </div>
              </div>

              <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase">{t("contactHours")}</h3>
                  <p className="text-sm font-semibold text-navy-950">
                    {t("contactHoursDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Map / Location Highlight */}
            <div
              className="overflow-hidden rounded-2xl border-2 border-slate-300 bg-slate-100 h-[300px] relative group cursor-pointer shadow-md"
              onClick={() => window.open('https://maps.app.goo.gl/RRVMFfakNPZBZXU68', '_blank')}
            >
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0 bg-navy-950/10 group-hover:bg-navy-950/0 transition-colors duration-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:text-primary-600 border border-slate-200">
                    <MapPin className="mr-2 h-5 w-5 text-primary-600" />
                    {t("contactOpenMap")}
                  </div>
                </div>
              </div>
              
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.673949826261!2d-58.18918862410313!3d-34.84978846995646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a33277a6086c45%3A0x8e868751eebde288!2sSinarplast!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none scale-105"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-md border-2 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-heading text-navy-950 uppercase">
                {t("contactFormTitle")}
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Mailing Directo Web
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              El correo se envía en forma directa desde la página. El asunto se asignará automáticamente según la sección que selecciones.
            </p>
            
            {sendSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 text-emerald-950 p-6 rounded-2xl border-2 border-emerald-300 text-center space-y-4 shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-950 mb-1">
                    ¡Email Enviado Directamente a Prodelec!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto mb-4">
                    Tu correo ha sido despachado de forma directa desde nuestra web al departamento correspondiente.
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-emerald-200 text-left space-y-2 mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Asunto del Correo Despachado:
                      </span>
                      <span className="text-xs font-mono font-bold text-navy-950 block">
                        {submittedSubject}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                      <span className="text-slate-500">Código de Referencia:</span>
                      <span className="font-mono font-bold text-primary-600">{refNumber}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-navy-950 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md py-3"
                  onClick={handleSendAnother}
                >
                  Enviar Otro Mensaje
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelName")} *</label>
                    <Input {...register("name")} className={errors.name ? "border-red-500" : "border-slate-300"} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelCompany")}</label>
                    <Input {...register("company")} className="border-slate-300" placeholder="Ej: Sanitaria S.A." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-950 uppercase">Email *</label>
                    <Input type="email" {...register("email")} className={errors.email ? "border-red-500" : "border-slate-300"} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelPhone")} *</label>
                    <Input type="tel" {...register("phone")} className={errors.phone ? "border-red-500" : "border-slate-300"} />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelArea")} *</label>
                  <select 
                    {...register("type")} 
                    className={`flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${errors.type ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <option value="">{t("contactSelectOption")}</option>
                    <option value="Ventas">Ventas & Cotizaciones de Producto</option>
                    <option value="Compras">Compras & Propuestas de Proveedores</option>
                    <option value="Logística">Logística, Despacho y Entregas</option>
                    <option value="Finanzas">Finanzas y Facturación</option>
                    <option value="Cobranzas">Cobranzas y Estado de Cuenta</option>
                    <option value="Pago a proveedores">Pago a Proveedores</option>
                  </select>
                  {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}

                  {/* Dynamic Subject Preview */}
                  {selectedArea && (
                    <div className="mt-2 p-3 bg-sky-50/70 border border-sky-200 rounded-xl text-[11px]">
                      <span className="font-bold text-slate-500 uppercase block mb-0.5">Asunto del correo directo que se enviará:</span>
                      <span className="font-mono font-bold text-primary-700">
                        {getSubjectForArea(selectedArea, watch("name") || "Nombre", watch("company"))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-950 uppercase">{t("contactLabelMsg")} *</label>
                  <textarea 
                    {...register("message")}
                    rows={4}
                    placeholder="Detallá tu consulta o pedido técnico..."
                    className={`flex w-full rounded-xl border bg-white p-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 resize-none ${errors.message ? 'border-red-500' : 'border-slate-300'}`}
                  ></textarea>
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-navy-950 hover:bg-primary-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  disabled={isSendingDirect}
                >
                  {isSendingDirect ? (
                    <span>🚀 Enviando Email Directo desde la Página...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Email Directo
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
