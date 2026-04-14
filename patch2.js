const fs = require('fs');
const files = [
  'app/(marketing)/propuesta-1/page.tsx',
  'app/(marketing)/propuesta-2/page.tsx',
  'app/(marketing)/propuesta-3/page.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace('@/components/WhatsAppWrapper', '../../../components/WhatsAppWrapper');
  fs.writeFileSync(f, content);
});
