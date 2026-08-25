const fs = require('fs');
const path = require('path');

const newKeysES = {
  contactHeroTitle: "Estamos para ayudarte",
  contactHeroDesc: "Nuestro equipo de especialistas está a su disposición para brindarle asesoramiento técnico y comercial.",
  contactFormTitle: "Envíenos su consulta",
  contactSuccessTitle: "¡Mensaje enviado con éxito!",
  contactSuccessDesc: "Nos pondremos en contacto a la brevedad.",
  contactSendAnother: "Enviar otro mensaje",
  contactLabelName: "Nombre Completo *",
  contactLabelCompany: "Empresa",
  contactLabelPhone: "Teléfono *",
  contactLabelArea: "Área de interés *",
  contactSelectOption: "Seleccione una opción",
  contactLabelMsg: "Mensaje *",
  contactSending: "Enviando...",
  contactSendBtn: "Enviar Mensaje",
  contactAreaLog: "Logística",
  contactAreaPay: "Pago a proveedores",
  contactAreaCol: "Cobranzas",
  contactAreaPur: "Compras",
  contactAreaSal: "Ventas",
  contactAreaFin: "Finanzas"
};

const newKeysEN = {
  contactHeroTitle: "We are here to help",
  contactHeroDesc: "Our team of specialists is at your disposal to provide technical and commercial advice.",
  contactFormTitle: "Send us your inquiry",
  contactSuccessTitle: "Message sent successfully!",
  contactSuccessDesc: "We will contact you shortly.",
  contactSendAnother: "Send another message",
  contactLabelName: "Full Name *",
  contactLabelCompany: "Company",
  contactLabelPhone: "Phone *",
  contactLabelArea: "Area of Interest *",
  contactSelectOption: "Select an option",
  contactLabelMsg: "Message *",
  contactSending: "Sending...",
  contactSendBtn: "Send Message",
  contactAreaLog: "Logistics",
  contactAreaPay: "Supplier Payment",
  contactAreaCol: "Collections",
  contactAreaPur: "Purchasing",
  contactAreaSal: "Sales",
  contactAreaFin: "Finance"
};

const newKeysPT = {
  contactHeroTitle: "Estamos aqui para ajudar",
  contactHeroDesc: "Nossa equipe de especialistas está à sua disposição para fornecer consultoria técnica e comercial.",
  contactFormTitle: "Envie-nos sua consulta",
  contactSuccessTitle: "Mensagem enviada com sucesso!",
  contactSuccessDesc: "Entraremos em contato em breve.",
  contactSendAnother: "Enviar outra mensagem",
  contactLabelName: "Nome Completo *",
  contactLabelCompany: "Empresa",
  contactLabelPhone: "Telefone *",
  contactLabelArea: "Área de Interesse *",
  contactSelectOption: "Selecione uma opção",
  contactLabelMsg: "Mensagem *",
  contactSending: "Enviando...",
  contactSendBtn: "Enviar Mensagem",
  contactAreaLog: "Logística",
  contactAreaPay: "Pagamento de Fornecedores",
  contactAreaCol: "Cobranças",
  contactAreaPur: "Compras",
  contactAreaSal: "Vendas",
  contactAreaFin: "Finanças"
};

const newKeysZH = {
  contactHeroTitle: "我们随时为您提供帮助",
  contactHeroDesc: "我们的专家团队随时准备为您提供技术和商业建议。",
  contactFormTitle: "发送您的查询",
  contactSuccessTitle: "消息发送成功！",
  contactSuccessDesc: "我们会尽快与您联系。",
  contactSendAnother: "发送另一条消息",
  contactLabelName: "全名 *",
  contactLabelCompany: "公司",
  contactLabelPhone: "电话 *",
  contactLabelArea: "感兴趣的领域 *",
  contactSelectOption: "选择一个选项",
  contactLabelMsg: "留言 *",
  contactSending: "发送中...",
  contactSendBtn: "发送留言",
  contactAreaLog: "物流",
  contactAreaPay: "供应商付款",
  contactAreaCol: "收款",
  contactAreaPur: "采购",
  contactAreaSal: "销售",
  contactAreaFin: "财务"
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
console.log('Translations updated (contacto).');
