export type I18nText = {
  es: string;
  en: string;
  pt: string;
  zh: string;
};

export type I18nList = {
  es: string[];
  en: string[];
  pt: string[];
  zh: string[];
};

export interface Spec {
  label: string;
  value: string;
  labelI18n?: I18nText;
}

export interface ProductModel {
  code: string;
  name: string;
  nameI18n?: I18nText;
  dimensions?: string;
  diameter?: string;
  material?: string;
  resistance?: string;
  homologado?: boolean;
  technicalSheet?: string;
}

/** Ficha técnica descargable de un modelo de la línea. */
export interface TechnicalSheetRef {
  /** Nombre técnico del modelo, tal como figura en el PDF oficial. */
  label: string;
  /** Ruta pública del PDF, por ejemplo "/fichas/ficha-tecnica-caja-compacta-c1401-cs.pdf". */
  url: string;
}

/**
 * Nicho de aplicación. Agrupación de negocio aprobada por PRODELEC (2026-10-15).
 * Una categoría puede pertenecer a más de un nicho (p. ej. las cajas de conexión
 * sirven para agua, saneamiento y gas).
 */
export type Niche = "agua" | "saneamiento" | "gas" | "domiciliaria";

/** Orden de presentación de los nichos en el catálogo. */
export const NICHE_ORDER: Niche[] = ["agua", "saneamiento", "gas", "domiciliaria"];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  subcategories?: string[];
  color?: string; // Subtle industrial accent color
  nameI18n?: I18nText;
  descriptionI18n?: I18nText;
  subcategoriesI18n?: I18nList;
  technicalSheet?: string;
  /**
   * Nichos de aplicación a los que pertenece la categoría. Aprobado por el
   * cliente; el primero de la lista es el que define la sección principal.
   */
  niches?: Niche[];
  /**
   * Fichas de los modelos de la categoría que todavía no están publicados como
   * producto (la línea real de PRODELEC es más amplia que el catálogo). Se
   * listan a nivel categoría para que el PDF quede accesible igual.
   */
  technicalSheets?: TechnicalSheetRef[];
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string; // Código oficial de producto
  family?: string; // Product family name or grouping
  categoryId: string;
  subcategory?: string;
  description: string;
  features: string[];
  specs: Spec[];
  images: string[];
  isNew: boolean;
  inStock: boolean;
  homologado?: boolean;
  tags?: string[]; // Data-driven tag identifiers: "homologado", "estandar", "inserto", "racor_bronce", etc.
  diameter?: string; // e.g. "50mm a 110mm", "DN110"
  sizeInfo?: string; // e.g. "400 × 200 × 180 mm"
  architecture?: string[];
  technicalSheet?: string; // Link to official PDF
  models?: ProductModel[]; // Variant/sub-models under this product
  familyColor?: string; // Subtle border/accent tone
  nameI18n?: I18nText;
  descriptionI18n?: I18nText;
  featuresI18n?: I18nList;
  price?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
