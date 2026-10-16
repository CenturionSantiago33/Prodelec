import { es } from "./es";
import { en } from "./en";
import { pt } from "./pt";
import { zh } from "./zh";
import { Category, Product, Spec } from "@/types";

export type LanguageCode = "ES" | "EN" | "PT" | "ZH";
export type LangKey = "es" | "en" | "pt" | "zh";

/** Firma de la función de traducción devuelta por `useTranslation` / `createTranslator`. */
export type TranslateFn = (key: string, fallback?: string) => string;

type LocalizedProduct = Product & {
  specsI18n?: Partial<Record<LangKey, Spec[]>>;
};

export const translations: Record<LanguageCode, Record<string, string>> = {
  ES: es,
  EN: en,
  PT: pt,
  ZH: zh,
};

/**
 * Returns a translation function `t(key, fallback)` for the given language.
 * Supports dot notation keys, e.g. t("nav.home") or legacy keys like t("navHome").
 *
 * Nota: es una fábrica pura (no usa hooks de React). Se exporta además como
 * `useTranslation` por compatibilidad con el código existente.
 */
export const createTranslator = (lang: LanguageCode = "ES"): TranslateFn => {
  const currentLang = (lang && translations[lang]) ? lang : "ES";
  const dict = translations[currentLang] || translations.ES;

  return (key: string, fallback?: string): string => {
    if (!key) return "";

    // 1. Direct key match (e.g. "nav.home" or "home.hero.title1")
    if (dict[key] !== undefined) {
      return dict[key];
    }

    // 2. Check legacy camelCase mapping if not found directly
    const legacyMap: Record<string, string> = {
      navHome: "nav.home",
      navCompany: "nav.company",
      navCatalog: "nav.catalog",
      navNews: "nav.news",
      navEquipment: "nav.equipment",
      navLocation: "nav.location",
      navContact: "nav.contact",
      searchPlaceholder: "nav.search",
      quote: "nav.quote",
      cartTitle: "cart.title",
      cartEmpty: "cart.emptyTitle",
      cartEmptyDesc: "cart.emptyDesc",
      cartClear: "cart.btnClear",
      catTitle: "catalog.title",
      catSubtitle: "catalog.subtitle",
      catFamilies: "catalog.allFamilies",
      catModels: "common.code",
      catSearchPlaceholder: "catalog.searchPlaceholder",
      catViewProducts: "catalog.viewProducts",
      catAllProductsTitle: "catalog.allProductsTitle",
      catAllProductsSub: "catalog.allProductsSub",
      catNoProductsFound: "catalog.noResultsTitle",
      catNoProductsSub: "catalog.noResultsSub",
      catResetFilters: "catalog.resetFilters",
      catBackToAll: "common.backToAll",
      catViewFull: "common.viewFull",
      catAddToQuote: "common.addToQuote",
      catPdfCatalog: "common.officialCatalog",
      catPdfSpecs: "common.unifiedSpecs",
      catSortRel: "catalog.sortRel",
      catSortAZ: "catalog.sortAZ",
      catSortZA: "catalog.sortZA",
      catSortNew: "catalog.sortNew",
      catCategories: "catalog.categoriesTitle",
      catDiameter: "catalog.filterDiameter",
      catAll: "common.all",
      catFilters: "common.filters",
      catClearFilters: "catalog.filterClear",
      catResult: "catalog.productsWord",
      catResults: "catalog.productsWord",
      catFamiliesHeadline: "catalog.categoriesTitle",
      catFamilyTitle: "catalog.title",
      catAdvancedFilters: "catalog.advancedFilters",
      tagline: "footer.tagline",
      footerDesc: "footer.desc",
      footerCompany: "footer.company",
      footerCatalog: "footer.catalog",
      footerOurHistory: "footer.ourHistory",
      footerCertifications: "footer.certifications",
      footerViewAll: "footer.viewAllProducts",
      footerHours: "footer.hours",
      footerHoursVal: "footer.hoursVal",
      footerRights: "footer.rights",
      contactHeroTitle: "contact.hero.title",
      contactHeroDesc: "contact.hero.desc",
      contactTitle: "contact.infoTitle",
      contactPhone: "location.phone",
      contactHours: "location.hours",
      empresaYears: "empresa.hero.years",
      empresaHeroTitle: "empresa.hero.title",
      empresaHeroDesc: "empresa.hero.desc",
      empresaPillar1Title: "empresa.pillar1.title",
      empresaPillar1Desc: "empresa.pillar1.desc",
      empresaPillar2Title: "empresa.pillar2.title",
      empresaPillar2Desc: "empresa.pillar2.desc",
      empresaPillar3Title: "empresa.pillar3.title",
      empresaPillar3Desc: "empresa.pillar3.desc",
      empresaPillar4Title: "empresa.pillar4.title",
      empresaPillar4Desc: "empresa.pillar4.desc",
      empresaEvo: "empresa.timeline.eyebrow",
      empresaHistoryTitle: "empresa.timeline.title",
      empresaHist1Year: "empresa.h1.year",
      empresaHist1Title: "empresa.h1.title",
      empresaHist1Desc: "empresa.h1.desc",
      empresaHist2Year: "empresa.h2.year",
      empresaHist2Title: "empresa.h2.title",
      empresaHist2Desc: "empresa.h2.desc",
      empresaHist3Year: "empresa.h3.year",
      empresaHist3Title: "empresa.h3.title",
      empresaHist3Desc: "empresa.h3.desc",
      empresaHist4Year: "empresa.h4.year",
      empresaHist4Title: "empresa.h4.title",
      empresaHist4Desc: "empresa.h4.desc",
      empresaWarranty: "badge.homologado",
      empresaCertTitle: "empresa.cert.title",
      equipHeroSubtitle: "equipment.hero.badge",
      equipHeroTitle: "equipment.hero.title",
      equipHeroDesc: "equipment.hero.desc",
      equipDeptTag: "equipment.deptTag",
      equipDept1Name: "equipment.dept1.name",
      equipDept1Desc: "equipment.dept1.desc",
      equipDept1Skill1: "equipment.dept1.s1",
      equipDept1Skill2: "equipment.dept1.s2",
      equipDept1Skill3: "equipment.dept1.s3",
      equipDept2Name: "equipment.dept2.name",
      equipDept2Desc: "equipment.dept2.desc",
      equipDept2Skill1: "equipment.dept2.s1",
      equipDept2Skill2: "equipment.dept2.s2",
      equipDept2Skill3: "equipment.dept2.s3",
      equipDept3Name: "equipment.dept3.name",
      equipDept3Desc: "equipment.dept3.desc",
      equipDept3Skill1: "equipment.dept3.s1",
      equipDept3Skill2: "equipment.dept3.s2",
      equipDept3Skill3: "equipment.dept3.s3",
      equipDept4Name: "equipment.dept4.name",
      equipDept4Desc: "equipment.dept4.desc",
      equipDept4Skill1: "equipment.dept4.s1",
      equipDept4Skill2: "equipment.dept4.s2",
      equipDept4Skill3: "equipment.dept4.s3",
      equipDept5Name: "equipment.dept5.name",
      equipDept5Desc: "equipment.dept5.desc",
      equipDept5Skill1: "equipment.dept5.s1",
      equipDept5Skill2: "equipment.dept5.s2",
      equipDept5Skill3: "equipment.dept5.s3",
      newsLaunches: "news.launchesTitle",
      newsLaunchesSub: "news.launchesSub",
      newsMostViewed: "news.mostViewedTitle",
      newsMostViewedSub: "news.mostViewedSub",
      newsNewsletterTitle: "news.newsletterTitle",
      newsNewsletterDesc: "news.newsletterDesc",
      newsNewsletterPlaceholder: "news.newsletterPlaceholder",
      newsNewsletterBtn: "news.newsletterBtn",
      newsNewsletterPrivacy: "news.newsletterSuccess",
      techDocuments: "news.docsTitle",
      favorites: "favorites.title",
      favTitle: "favorites.title",
      favEmptyTitle: "favorites.emptyTitle",
      favEmptyDesc: "favorites.emptyDesc",
      cartGoCatalog: "favorites.btnCatalog",

      // Location page
      "location.headquarters": "location.hero.badge",
      "location.heroDesc": "location.hero.desc",
      "location.infoTitle": "location.cardTitle",
      "location.addressTitle": "location.address",
      contactOpenMap: "location.btnMaps",

      // Empresa page
      empresaConsult: "empresa.cert.btnPliego",

      // Contact form
      contactFormTitle: "contact.formTitle",
      contactLabelName: "contact.labelName",
      contactLabelCompany: "contact.labelCompany",
      contactLabelPhone: "contact.labelPhone",
      contactLabelArea: "contact.labelArea",
      contactLabelMsg: "contact.labelMessage",
      contactSelectOption: "contact.placeholderArea",
      contactSubmitBtn: "contact.btnSend",
      contactSuccessTitle: "contact.successTitle",
      contactSuccessMsg: "contact.successDesc",
      contactAnotherMsg: "contact.btnSendAnother",
      contactAreaSales: "contact.areaVentas",
      contactAreaPurchasing: "contact.areaCompras",
      contactAreaLogistics: "contact.areaLogistica",
      contactAreaFinance: "contact.areaFinanzas",
      contactAreaGeneral: "contact.areaGeneral",
      contactAreaCollections: "contact.areaCobranzas",
      contactAreaSuppliers: "contact.areaSuppliers",

      // Equipment page
      equipCultureTitle: "equipment.cultureTitle",
      equipCultureDesc: "equipment.cultureDesc",
      equipCultureBtn: "equipment.btnHistory",
      equipContactDept: "equipment.contactDept",

      // Product detail & badges
      catHomologated: "badge.homologado",
      catHomologatedBadge: "badge.homologado",
      catNorms: "common.standard",
      techSheet: "common.technicalSheet",
      techSheetUnified: "common.unifiedSpecs",
      generalCatalogPdf: "common.officialCatalog",
      isoCertPdf: "empresa.cert.cardTitle",
      specs: "product.tabSpecs",
      specsMatrix: "product.specsMatrix",
      specsDimensions: "common.dimensions",
      specsDiameterRange: "catalog.filterDiameter",
      specsPressure: "common.pressure",
      specsTorque: "specs.torque",
      standardsTitle: "common.standard",
      standardsIram: "empresa.cert.iram",
      standardsPotableWater: "empresa.cert.potable",
      relatedProducts: "product.relatedTitle",
      badgeNew: "badge.new",
      favorite: "favorites.title",
      prodDimensions: "common.dimensions",
      prodDiameter: "catalog.filterDiameter",
      prodFeatures: "product.mainFeatures",
      addToQuote: "common.addToQuote",
      catNotFound: "product.notFoundTitle",
      catNoProductsDesc: "product.notFoundDesc",
      backToCatalog: "common.backToCatalog",
    };

    const mappedKey = legacyMap[key];
    if (mappedKey && dict[mappedKey] !== undefined) {
      return dict[mappedKey];
    }

    // 3. Fallback to Spanish dictionary
    if (translations.ES[key] !== undefined) {
      return translations.ES[key];
    }
    if (mappedKey && translations.ES[mappedKey] !== undefined) {
      return translations.ES[mappedKey];
    }

    // 4. Return user fallback or key
    return fallback !== undefined ? fallback : key;
  };
};

/** Alias compatible con el nombre histórico (fábrica pura, no es un hook de React). */
export const useTranslation = createTranslator;

/**
 * Returns translated product using data-driven localized fields if present,
 * or falling back gracefully to base fields.
 */
export function getTranslatedProduct(prod: Product, lang: LanguageCode | string): Product {
  const normLang = ((lang || "ES").toUpperCase()) as LanguageCode;
  const langKey = normLang.toLowerCase() as LangKey;

  const localized = prod as LocalizedProduct;

  // Name
  let name = prod.name;
  if (localized.nameI18n && localized.nameI18n[langKey]) {
    name = localized.nameI18n[langKey];
  }

  // Description
  let description = prod.description;
  if (localized.descriptionI18n && localized.descriptionI18n[langKey]) {
    description = localized.descriptionI18n[langKey];
  }

  // Features
  let features = prod.features;
  if (localized.featuresI18n && localized.featuresI18n[langKey]) {
    features = localized.featuresI18n[langKey];
  }

  // Specs
  let specs = prod.specs;
  if (localized.specsI18n && localized.specsI18n[langKey]) {
    specs = localized.specsI18n[langKey] as Spec[];
  }

  return {
    ...prod,
    name,
    description,
    features,
    specs,
  };
}

/**
 * Returns translated category using data-driven localized fields.
 * Supports passing either a Category object or a category slug/name string.
 */
export function getTranslatedCategory(cat: Category, lang: LanguageCode | string): Category;
export function getTranslatedCategory(catSlug: string, lang: LanguageCode | string, fallbackName?: string): string;
export function getTranslatedCategory(catOrSlug: Category | string, lang: LanguageCode | string, fallbackName?: string): Category | string {
  const normLang = ((lang || "ES").toUpperCase()) as LanguageCode;
  const langKey = normLang.toLowerCase() as LangKey;

  if (typeof catOrSlug === "string") {
    // If it's a slug or string, return the fallback name or the slug
    return fallbackName || catOrSlug;
  }

  const cat = catOrSlug;

  let name = cat.name;
  if (cat.nameI18n && cat.nameI18n[langKey]) {
    name = cat.nameI18n[langKey];
  }

  let description = cat.description;
  if (cat.descriptionI18n && cat.descriptionI18n[langKey]) {
    description = cat.descriptionI18n[langKey];
  }

  let subcategories = cat.subcategories;
  if (cat.subcategoriesI18n && cat.subcategoriesI18n[langKey]) {
    subcategories = cat.subcategoriesI18n[langKey];
  }

  return {
    ...cat,
    name,
    description,
    subcategories,
  };
}

/**
 * Returns localized tag label
 */
export function getTranslatedTag(tagKey: string, lang: LanguageCode | string): string {
  const normLang = ((lang || "ES").toUpperCase()) as LanguageCode;
  const t = createTranslator(normLang);
  const cleanKey = tagKey.toLowerCase().replace(/[\s-]+/g, "_");
  const fullKey = `tag.${cleanKey}`;
  return t(fullKey, tagKey.toUpperCase());
}
