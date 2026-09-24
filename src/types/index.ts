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
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string; // SKU or official item code
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
