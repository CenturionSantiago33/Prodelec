const fs = require('fs');
const path = require('path');

const newKeysES = {
  slide1Title1: "Precisión en cada",
  slide1Title2: "Conexión",
  slide1Desc: "Fabricantes referentes en componentes plásticos de ingeniería para redes de agua potable y saneamiento. Más de 39 años respaldando las obras de infraestructura más exigentes con calidad homologada.",
  slide2Title1: "Líderes en",
  slide2Title2: "Agua y Saneamiento",
  slide2Desc: "Producción nacional con tecnología de inyección robótica y control de calidad bajo estrictas normas ISO y requerimientos directos de las principales prestatarias del país.",
  slide3Title1: "Confianza para tu",
  slide3Title2: "Infraestructura",
  slide3Desc: "10 familias completas de productos homologados, stock permanente y capacidad logística para responder con solvencia en cualquier punto del territorio.",
  slideBadge: "39 años en la industria",
  slideBtn1: "Ver Catálogo Técnico",
  slideBtn2: "Certificaciones ISO",
  news1Title: "Nuevas Cajas de Conexión Homologadas 2026",
  news1Date: "10 Ago, 2026",
  news1Cat: "Lanzamientos",
  news1Desc: "Conocé la nueva línea de cajas compactas y base abierta, aprobadas para soportar hasta 3.000 kg en instalaciones exigentes.",
  news2Title: "Prodelec expande su capacidad de inyección",
  news2Date: "25 Jul, 2026",
  news2Cat: "Institucional",
  news2Desc: "Incorporamos nueva tecnología robótica en nuestra planta para aumentar el volumen de producción y asegurar tiempos de entrega.",
  news3Title: "Nueva Ficha Técnica Unificada v3.0",
  news3Date: "05 Jun, 2026",
  news3Cat: "Documentos",
  news3Desc: "Descargá el último manual técnico con tolerancias, medidas exactas e instrucciones de instalación paso a paso.",
  newsReadMore: "Leer artículo completo",
  newsViewAll: "Ver todas las Novedades",
  homeSect1Title: "Nuestros Clientes",
  homeSect1Desc: "Prestatarias y Contratistas de Infraestructura",
  homeSect2Title: "¿Por qué elegir Prodelec?",
  homeSect2Desc: "Soluciones integrales de alta precisión técnica para redes de agua y saneamiento.",
  homeReason1Title: "Calidad Homologada",
  homeReason1Desc: "Aprobación directa de las principales prestatarias de agua y saneamiento del país.",
  homeReason2Title: "Planta 24/7",
  homeReason2Desc: "Capacidad productiva continua para responder a grandes proyectos sin demoras.",
  homeReason3Title: "Matricería Propia",
  homeReason3Desc: "Desarrollo in-house de matrices para garantizar precisión micrométrica.",
  homeReason4Title: "Stock Permanente",
  homeReason4Desc: "Logística ágil y eficiente con amplios depósitos para entrega inmediata."
};

const newKeysEN = {
  slide1Title1: "Precision in every",
  slide1Title2: "Connection",
  slide1Desc: "Leading manufacturers of engineering plastic components for drinking water and sanitation networks. Over 39 years supporting the most demanding infrastructure projects with certified quality.",
  slide2Title1: "Leaders in",
  slide2Title2: "Water and Sanitation",
  slide2Desc: "National production with robotic injection technology and quality control under strict ISO standards and direct requirements of the main utility companies.",
  slide3Title1: "Trust for your",
  slide3Title2: "Infrastructure",
  slide3Desc: "10 complete families of certified products, permanent stock, and logistical capacity to respond reliably anywhere in the territory.",
  slideBadge: "39 years in the industry",
  slideBtn1: "View Technical Catalog",
  slideBtn2: "ISO Certifications",
  news1Title: "New Approved Connection Boxes 2026",
  news1Date: "Aug 10, 2026",
  news1Cat: "Launches",
  news1Desc: "Discover the new line of compact and open-base boxes, approved to support up to 3,000 kg in demanding installations.",
  news2Title: "Prodelec expands its injection capacity",
  news2Date: "Jul 25, 2026",
  news2Cat: "Institutional",
  news2Desc: "We incorporate new robotic technology in our plant to increase production volume and ensure delivery times.",
  news3Title: "New Unified Data Sheet v3.0",
  news3Date: "Jun 05, 2026",
  news3Cat: "Documents",
  news3Desc: "Download the latest technical manual with tolerances, exact measurements, and step-by-step installation instructions.",
  newsReadMore: "Read full article",
  newsViewAll: "View all News",
  homeSect1Title: "Our Clients",
  homeSect1Desc: "Infrastructure Contractors and Utility Companies",
  homeSect2Title: "Why choose Prodelec?",
  homeSect2Desc: "Comprehensive high-precision technical solutions for water and sanitation networks.",
  homeReason1Title: "Certified Quality",
  homeReason1Desc: "Direct approval from the main water and sanitation utility companies in the country.",
  homeReason2Title: "24/7 Plant",
  homeReason2Desc: "Continuous production capacity to respond to large projects without delays.",
  homeReason3Title: "In-house Tooling",
  homeReason3Desc: "In-house development of molds to ensure micrometric precision.",
  homeReason4Title: "Permanent Stock",
  homeReason4Desc: "Agile and efficient logistics with large warehouses for immediate delivery."
};

const newKeysPT = {
  slide1Title1: "Precisão em cada",
  slide1Title2: "Conexão",
  slide1Desc: "Fabricantes de referência em componentes plásticos de engenharia para redes de água potável e saneamento. Mais de 39 anos apoiando os projetos de infraestrutura mais exigentes com qualidade certificada.",
  slide2Title1: "Líderes em",
  slide2Title2: "Água e Saneamento",
  slide2Desc: "Produção nacional com tecnologia de injeção robótica e controle de qualidade sob rigorosas normas ISO e exigências diretas das principais concessionárias do país.",
  slide3Title1: "Confiança para a sua",
  slide3Title2: "Infraestrutura",
  slide3Desc: "10 famílias completas de produtos certificados, estoque permanente e capacidade logística para responder com confiabilidade em qualquer lugar do território.",
  slideBadge: "39 anos na indústria",
  slideBtn1: "Ver Catálogo Técnico",
  slideBtn2: "Certificações ISO",
  news1Title: "Novas Caixas de Conexão Aprovadas 2026",
  news1Date: "10 Ago, 2026",
  news1Cat: "Lançamentos",
  news1Desc: "Conheça a nova linha de caixas compactas e de base aberta, aprovadas para suportar até 3.000 kg em instalações exigentes.",
  news2Title: "Prodelec expande sua capacidade de injeção",
  news2Date: "25 Jul, 2026",
  news2Cat: "Institucional",
  news2Desc: "Incorporamos nova tecnologia robótica em nossa fábrica para aumentar o volume de produção e garantir prazos de entrega.",
  news3Title: "Nova Ficha Técnica Unificada v3.0",
  news3Date: "05 Jun, 2026",
  news3Cat: "Documentos",
  news3Desc: "Baixe o manual técnico mais recente com tolerâncias, medidas exatas e instruções de instalação passo a passo.",
  newsReadMore: "Ler artigo completo",
  newsViewAll: "Ver todas as Novidades",
  homeSect1Title: "Nossos Clientes",
  homeSect1Desc: "Concessionárias e Empreiteiras de Infraestrutura",
  homeSect2Title: "Por que escolher a Prodelec?",
  homeSect2Desc: "Soluções técnicas abrangentes de alta precisão para redes de água e saneamento.",
  homeReason1Title: "Qualidade Certificada",
  homeReason1Desc: "Aprovação direta das principais concessionárias de água e saneamento do país.",
  homeReason2Title: "Planta 24/7",
  homeReason2Desc: "Capacidade de produção contínua para responder a grandes projetos sem atrasos.",
  homeReason3Title: "Ferramentaria Própria",
  homeReason3Desc: "Desenvolvimento interno de moldes para garantir precisão micrométrica.",
  homeReason4Title: "Estoque Permanente",
  homeReason4Desc: "Logística ágil e eficiente com grandes armazéns para entrega imediata."
};

const newKeysZH = {
  slide1Title1: "每一次连接的",
  slide1Title2: "精准度",
  slide1Desc: "饮用水和卫生管网工程塑料组件的领先制造商。超过39年的经验，以经过认证的质量支持要求最苛刻的基础设施项目。",
  slide2Title1: "饮用水和卫生设施",
  slide2Title2: "领域的领导者",
  slide2Desc: "采用机器人注塑技术和质量控制的全国生产，符合严格的ISO标准和该国主要公用事业公司的直接要求。",
  slide3Title1: "为您基础设施提供的",
  slide3Title2: "信任",
  slide3Desc: "10个完整的认证产品系列、常年库存和物流能力，可在全境任何地点可靠响应。",
  slideBadge: "从事行业39年",
  slideBtn1: "查看技术目录",
  slideBtn2: "ISO 认证",
  news1Title: "2026年新型认证接线盒",
  news1Date: "2026年8月10日",
  news1Cat: "产品发布",
  news1Desc: "了解新型紧凑型和开底盒系列，经过认证，可在要求苛刻的安装中支撑高达3,000公斤的重量。",
  news2Title: "Prodelec 扩大其注塑能力",
  news2Date: "2026年7月25日",
  news2Cat: "企业新闻",
  news2Desc: "我们在工厂引入了新的机器人技术，以提高产量并确保交货时间。",
  news3Title: "全新统一数据表 v3.0",
  news3Date: "2026年6月5日",
  news3Cat: "文档",
  news3Desc: "下载包含公差、精确尺寸和逐步安装说明的最新技术手册。",
  newsReadMore: "阅读全文",
  newsViewAll: "查看所有新闻",
  homeSect1Title: "我们的客户",
  homeSect1Desc: "基础设施承包商和公用事业公司",
  homeSect2Title: "为什么选择 Prodelec？",
  homeSect2Desc: "针对水务和卫生网络的高精度全面技术解决方案。",
  homeReason1Title: "认证质量",
  homeReason1Desc: "获得该国主要水务和卫生公用事业公司的直接批准。",
  homeReason2Title: "全天候工厂",
  homeReason2Desc: "持续的生产能力，能够无延迟地响应大型项目。",
  homeReason3Title: "内部模具制造",
  homeReason3Desc: "内部开发模具以确保微米级精度。",
  homeReason4Title: "常年库存",
  homeReason4Desc: "灵活高效的物流，拥有大型仓库可立即发货。"
};

const filePath = path.join(__dirname, '..', 'i18n', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

const insertKeys = (langObj, content, langCode) => {
  const marker = `  ${langCode}: {\n`;
  const index = content.indexOf(marker);
  if (index === -1) return content;
  
  const insertIndex = index + marker.length;
  let newKeysStr = '';
  for (const [key, value] of Object.entries(langObj)) {
    newKeysStr += `    ${key}: ${JSON.stringify(value)},\n`;
  }
  
  return content.slice(0, insertIndex) + newKeysStr + content.slice(insertIndex);
}

content = insertKeys(newKeysES, content, 'ES');
content = insertKeys(newKeysEN, content, 'EN');
content = insertKeys(newKeysPT, content, 'PT');
content = insertKeys(newKeysZH, content, 'ZH');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Translations updated (page).');
