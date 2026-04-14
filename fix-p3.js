const fs = require('fs');
let file = 'app/(marketing)/propuesta-3/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. WhatsApp
if (!content.includes('WhatsAppWrapper')) {
  content = content.replace('import "./theme.css";', 'import { WhatsAppWrapper } from "../../../components/WhatsAppWrapper";\nimport "./theme.css";');
  content = content.replace('      </main>', '      </main>\n      <WhatsAppWrapper />');
}
content = content.replace(/\{\/\* Floating Action:[^}]+Consultation Hub.*?\*\/\}\s*<button.*?<\/button>/gs, '');
content = content.replace(/\{\/\* Consultation Hub \(FAB\).*?\*\/\}\s*<button.*?<\/button>/gs, '');

// 3. Navbar Fixes
content = content.replace('className="fixed top-12 sm:top-10 lg:top-[40px] w-full z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg"', 'className="fixed top-12 sm:top-10 lg:top-[40px] w-full z-40 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/10 transition-all"');
content = content.replace('text-slate-900 dark:text-slate-50', 'text-on-surface');
content = content.replace('text-amber-700 dark:text-amber-500 font-semibold border-b-2 border-amber-700', 'text-secondary font-bold border-b-2 border-secondary');
content = content.replace(/text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200/g, 'text-on-surface-variant hover:text-secondary');

// 4. Footer Fixes (Semantic)
const footerRegex = /<footer[\s\S]*?<\/footer>/;
const match = content.match(footerRegex);
if (match) {
  let footerContent = match[0];
  footerContent = footerContent.replace(/bg-slate-900/g, 'bg-primary');
  footerContent = footerContent.replace(/dark:bg-black/g, '');
  footerContent = footerContent.replace(/text-slate-400/g, 'text-on-primary-container');
  footerContent = footerContent.replace(/text-slate-500/g, 'text-on-primary/60');
  footerContent = footerContent.replace(/text-slate-50/g, 'text-on-primary');
  footerContent = footerContent.replace(/text-slate-200/g, 'text-white');
  footerContent = footerContent.replace(/text-amber-500/g, 'text-secondary-container');
  footerContent = footerContent.replace(/text-amber-600/g, 'text-secondary');
  footerContent = footerContent.replace(/decoration-amber-600/g, 'decoration-secondary');
  footerContent = footerContent.replace(/border-slate-800/g, 'border-white/10');
  content = content.replace(footerRegex, footerContent);
}

fs.writeFileSync(file, content);
