import { es, TranslationKey } from "./es";
import { en } from "./en";
import { pt } from "./pt";
import { zh } from "./zh";
import { Category, Product } from "@/types";

export type LanguageCode = "ES" | "EN" | "PT" | "ZH";

export const translations: Record<LanguageCode, Record<string, string>> = {
  ES: es,
  EN: en,
  PT: pt,
  ZH: zh,
};

/**
 * Returns a translation function `t(key, fallback)` for the given language.
 * Supports dot notation keys, e.g. t("nav.home") or legacy keys like t("navHome").
 */
export const useTranslation = (lang: LanguageCode = "ES") => {
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
      catModels: "common.sku",
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
      favorites: "favorites.title",
      favTitle: "favorites.title",
      favEmptyTitle: "favorites.emptyTitle",
      favEmptyDesc: "favorites.emptyDesc",
      cartGoCatalog: "favorites.btnCatalog",
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

/**
 * Returns translated product using data-driven localized fields if present,
 * or falling back gracefully to base fields.
 */
export function getTranslatedProduct(prod: Product, lang: LanguageCode | string): Product {
  const normLang = ((lang || "ES").toUpperCase()) as LanguageCode;
  const langKey = normLang.toLowerCase() as "es" | "en" | "pt" | "zh";

  const anyProd = prod as any;

  // Name
  let name = prod.name;
  if (anyProd.nameI18n && anyProd.nameI18n[langKey]) {
    name = anyProd.nameI18n[langKey];
  }

  // Description
  let description = prod.description;
  if (anyProd.descriptionI18n && anyProd.descriptionI18n[langKey]) {
    description = anyProd.descriptionI18n[langKey];
  }

  // Features
  let features = prod.features;
  if (anyProd.featuresI18n && anyProd.featuresI18n[langKey]) {
    features = anyProd.featuresI18n[langKey];
  }

  // Specs
  let specs = prod.specs;
  if (anyProd.specsI18n && anyProd.specsI18n[langKey]) {
    specs = anyProd.specsI18n[langKey];
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
export function getTranslatedCategory(catOrSlug: Category | string, lang: LanguageCode | string, fallbackName?: string): any {
  const normLang = ((lang || "ES").toUpperCase()) as LanguageCode;
  const langKey = normLang.toLowerCase() as "es" | "en" | "pt" | "zh";

  if (typeof catOrSlug === "string") {
    // If it's a slug or string, return the fallback name or the slug
    return fallbackName || catOrSlug;
  }

  const cat = catOrSlug;
  const anyCat = cat as any;

  let name = cat.name;
  if (anyCat.nameI18n && anyCat.nameI18n[langKey]) {
    name = anyCat.nameI18n[langKey];
  }

  let description = cat.description;
  if (anyCat.descriptionI18n && anyCat.descriptionI18n[langKey]) {
    description = anyCat.descriptionI18n[langKey];
  }

  let subcategories = cat.subcategories;
  if (anyCat.subcategoriesI18n && anyCat.subcategoriesI18n[langKey]) {
    subcategories = anyCat.subcategoriesI18n[langKey];
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
  const t = useTranslation(normLang);
  const cleanKey = tagKey.toLowerCase().replace(/[\s-]+/g, "_");
  const fullKey = `tag.${cleanKey}`;
  return t(fullKey, tagKey.toUpperCase());
}
