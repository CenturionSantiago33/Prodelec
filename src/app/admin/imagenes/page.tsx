"use client";

import { useState } from "react";
import { Upload, Image, CheckCircle2, X } from "lucide-react";
import { products } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function ImagenesAdminPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const selected = products.find(p => p.id === selectedProduct);

  const handleUpload = () => {
    setUploadFeedback(`Imagen de "${selected?.name}" actualizada. (Función de upload a conectar al backend)`);
    setTimeout(() => setUploadFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestión de Imágenes</h1>
        <p className="text-gray-500">Seleccioná un producto para actualizar sus fotografías.</p>
      </div>

      {uploadFeedback && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{uploadFeedback}</span>
          <button onClick={() => setUploadFeedback(null)} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Productos ({products.length})</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left border-b border-gray-50 transition-colors ${
                    selectedProduct === product.id
                      ? "bg-primary-50 border-l-2 border-l-primary-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-contain p-1"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{product.code}</p>
                    <p className="text-[10px] text-gray-400">{product.images.length} foto(s)</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Editor */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-200 h-96 flex flex-col items-center justify-center text-gray-400">
              <Image className="h-12 w-12 mb-3 opacity-40" />
              <p className="font-medium">Seleccioná un producto</p>
              <p className="text-sm">para gestionar sus imágenes</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <h2 className="font-semibold text-gray-900">{selected.name}</h2>
                <p className="text-xs text-gray-400 font-mono">SKU: {selected.code}</p>
              </div>

              {/* Current Images */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Imágenes actuales ({selected.images.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selected.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl bg-gray-50 border border-gray-200 overflow-hidden group">
                      <img
                        src={img}
                        alt={`${selected.name} imagen ${i + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="text-xs text-white font-medium bg-red-600 px-2 py-1 rounded-lg">Eliminar</button>
                      </div>
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Principal</span>
                      )}
                    </div>
                  ))}

                  {/* Upload placeholder */}
                  <div
                    onClick={handleUpload}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-600 hover:bg-primary-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary-600"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-xs font-medium">Subir foto</span>
                  </div>
                </div>
              </div>

              {/* Upload Zone */}
              <div
                onClick={handleUpload}
                className="border-2 border-dashed border-gray-300 hover:border-primary-600 rounded-xl p-8 text-center cursor-pointer hover:bg-primary-50 transition-all group"
              >
                <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400 group-hover:text-primary-600 transition-colors" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-primary-700">
                  Arrastrá imágenes aquí o hacé click para seleccionarlas
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG — Máx. 5MB por imagen</p>
              </div>

              <Button onClick={handleUpload} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
