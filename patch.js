const fs = require('fs');
const files = [
  'app/(marketing)/propuesta-1/page.tsx',
  'app/(marketing)/propuesta-2/page.tsx',
  'app/(marketing)/propuesta-3/page.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('WhatsAppWrapper')) {
    content = content.replace('import "./theme.css";', 'import { WhatsAppWrapper } from "@/components/WhatsAppWrapper";\nimport "./theme.css";');
    content = content.replace('      </main>', '      </main>\n      <WhatsAppWrapper />');
  }
  content = content.replace(/\{\/\* Floating Action:[^}]+Consultation Hub.*?\*\/\}\s*<button.*?<\/button>/gs, '');
  content = content.replace(/\{\/\* Consultation Hub \(FAB\).*?\*\/\}\s*<button.*?<\/button>/gs, '');
  fs.writeFileSync(f, content);
});
