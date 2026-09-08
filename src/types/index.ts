export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  subcategories?: string[]; // e.g. ["Homologadas", "Económicas"]
  color?: string; // accent color for the category card
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string;
  categoryId: string;
  subcategory?: string; // e.g. "Homologadas" | "No homologadas" | "Económicas"
  description: string;
  features: string[];
  specs: Spec[];
  images: string[];
  isNew: boolean;
  inStock: boolean;
  homologado?: boolean; // shows "HOMOLOGADO" badge
  diameter?: string; // e.g. "63mm a 160mm" for diameter filter
  architecture?: string[]; // e.g. ["Toma de Carga", "Redes de Agua Potable"]
  sizeInfo?: string; // dimensions/sizes instead of technical PDF
  price?: number; // Usually hidden or requires quote in B2B
}

export interface CartItem {
  product: Product;
  quantity: number;
}
