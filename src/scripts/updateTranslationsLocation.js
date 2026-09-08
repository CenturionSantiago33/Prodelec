const fs = require('fs');
const path = require('path');

const newKeysES = { navLocation: "Ubicación" };
const newKeysEN = { navLocation: "Location" };
const newKeysPT = { navLocation: "Localização" };
const newKeysZH = { navLocation: "地点" };

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
console.log('Translations updated (ubicacion).');
