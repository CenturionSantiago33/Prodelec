"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  FileText,
  Download,
  Send,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/translations";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalItems,
    language,
  } = useStore();
  const t = useTranslation(language);
  const totalItems = cartTotalItems();

  const handleDownloadPDFQuote = () => {
    if (cart.length === 0) return;

    const quoteRef = `PROD-COT-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const printWindow = window.open("", "_blank", "width=850,height=1100");
    if (!printWindow) return;

    const itemsHtml = cart
      .map(
        (item, index) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: bold; color: #0f172a; text-align: center;">${index + 1}</td>
          <td style="padding: 12px; font-weight: bold; color: #0f172a;">${item.product.code}</td>
          <td style="padding: 12px; color: #1e293b;">
            <strong>${item.product.name}</strong><br/>
            <span style="font-size: 11px; color: #64748b;">${item.product.sizeInfo || "Medidas de catálogo oficial"}</span>
          </td>
          <td style="padding: 12px; text-align: center; color: #0284c7; font-weight: bold;">
            ${item.product.homologado ? "✓ HOMOLOGADO" : "Estándar"}
          </td>
          <td style="padding: 12px; text-align: center; font-weight: bold; font-size: 15px;">${item.quantity}</td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Constancia de Cotización - ${quoteRef}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px; }
          .logo-text { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: 2px; }
          .subtitle { font-size: 11px; color: #0284c7; font-weight: bold; letter-spacing: 3px; }
          .company-info { text-align: right; font-size: 12px; color: #475569; line-height: 1.5; }
          .doc-title { background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .doc-title h2 { margin: 0; font-size: 18px; color: #0369a1; text-transform: uppercase; }
          .doc-title p { margin: 4px 0 0 0; font-size: 13px; color: #0284c7; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
          th { background: #0f172a; color: #ffffff; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
          .legal-notice { background: #f8fafc; border-left: 4px solid #0284c7; padding: 15px; font-size: 11px; color: #64748b; line-height: 1.6; margin-top: 30px; }
          .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 20px;">
          <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 12px 24px; font-weight: bold; border-radius: 8px; cursor: pointer;">
            🖨️ Imprimir / Guardar como PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo-text">PRODELEC</div>
            <div class="subtitle">SOLUCIONES INDUSTRIALES</div>
          </div>
          <div class="company-info">
            <strong>PRODELEC S.A.</strong><br/>
            Parque Industrial Good Park, Florencio Varela<br/>
            Buenos Aires, Argentina<br/>
            Email: prodelec@prodelec.com.ar | Tel: (54-11) 2341-3935
          </div>
        </div>

        <div class="doc-title">
          <div>
            <h2>CONSTANCIA DE PRE-COTIZACIÓN TÉCNICA</h2>
            <p>Emisión: ${today}</p>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 16px; color: #0f172a;">Ref: ${quoteRef}</strong><br/>
            <span style="font-size: 11px; color: #64748b;">Validez sugerida: 15 días</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 40px;">#</th>
              <th>SKU / Código</th>
              <th>Descripción del Producto</th>
              <th style="text-align: center;">Estado Homologado</th>
              <th style="text-align: center; width: 80px;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 15px; text-align: right; font-size: 14px; font-weight: bold; color: #0f172a;">
          Total de Ítems Solicitados: ${totalItems} unidad(es)
        </div>

        <div class="legal-notice">
          <strong>Aviso Legal y Técnico:</strong> Este documento constituye una constancia oficial de solicitud de cotización técnica emitida desde la plataforma Prodelec. No posee validez fiscal ni representa una factura de venta. Los precios finales, plazos de despacho y condiciones de entrega serán confirmados por nuestro Departamento Comercial al momento de emitir la Orden de Compra definitiva.
        </div>

        <div class="footer">
          Prodelec S.A. — Componentes de Ingeniería para Redes de Agua Potable y Saneamiento.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSendWhatsApp = () => {
    const phoneNumber = "5491123413935";
    let message = "Hola Prodelec, me gustaría solicitar la cotización formal de los siguientes ítems:\n\n";

    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.quantity}x ${item.product.name} (SKU: ${item.product.code})\n`;
    });
    message += `\nTotal de ítems: ${totalItems} unidad(es)`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => setCartOpen(false)}
      title={t("cartTitle")}
      side="right"
    >
      <div className="flex h-full flex-col font-sans text-slate-900">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center p-6">
            <div className="rounded-full bg-slate-100 p-6">
              <ShoppingCart className="h-12 w-12 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-950">{t("cartEmpty")}</p>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                {t("cartEmptyDesc") || "Agregá productos desde el catálogo para armar tu pedido de cotización."}
              </p>
            </div>
            <Button
              className="mt-4 bg-navy-950 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
              onClick={() => setCartOpen(false)}
            >
              Explorar Catálogo
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <ul className="divide-y divide-slate-200">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex py-4 first:pt-0 last:pb-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 flex items-center justify-center">
                      <img
                        src={item.product.images[0] || "https://placehold.co/200"}
                        alt={item.product.name}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-bold text-navy-950 leading-snug line-clamp-2">
                            <Link
                              href={`/productos/${item.product.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="hover:text-primary-600 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] font-mono text-slate-400">
                          SKU: {item.product.code}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-lg border border-slate-300 bg-white">
                          <button
                            type="button"
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-center w-8 text-xs font-extrabold font-mono text-navy-950">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {item.product.homologado && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            ✓ Homologado
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Actions */}
            <div className="border-t-2 border-slate-200 p-6 bg-white space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total de Ítems
                </span>
                <span className="text-lg font-extrabold font-mono text-navy-950">
                  {totalItems} unidades
                </span>
              </div>

              {/* Botón WhatsApp Directo */}
              <Button
                className="w-full h-12 text-xs font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                onClick={handleSendWhatsApp}
              >
                <Send className="h-4 w-4" />
                Enviar Cotización por WhatsApp
              </Button>

              {/* Botón PDF Proforma */}
              <Button
                variant="outline"
                className="w-full h-11 text-xs font-bold uppercase tracking-wider border-slate-300 text-slate-800 hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center gap-2"
                onClick={handleDownloadPDFQuote}
              >
                <FileText className="h-4 w-4 text-primary-600" />
                Descargar Constancia PDF (Proforma B2B)
              </Button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs text-red-500 hover:text-red-700 font-semibold pt-1"
              >
                {t("cartClear")}
              </button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
