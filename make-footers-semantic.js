const fs = require('fs');

const files = [
  'app/(marketing)/propuesta-1/page.tsx',
  'app/(marketing)/propuesta-2/page.tsx',
  'app/(marketing)/propuesta-3/page.tsx'
];

files.forEach((file, index) => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // We only want to replace tailwind hardcoded colors inside the <footer ...> </footer> block.
  // Let's extract the footer, modify it, and put it back.
  const footerRegex = /<footer[\s\S]*?<\/footer>/;
  const match = content.match(footerRegex);
  
  if (match) {
    let footerContent = match[0];

    // Remove hardcoded backgrounds
    footerContent = footerContent.replace(/bg-\[#001333\]/g, 'bg-primary');
    footerContent = footerContent.replace(/dark:bg-\[#000d26\]/g, '');
    footerContent = footerContent.replace(/bg-\[#001b44\]/g, 'bg-primary');
    footerContent = footerContent.replace(/bg-slate-900/g, 'bg-primary');
    footerContent = footerContent.replace(/dark:bg-black/g, '');
    footerContent = footerContent.replace(/dark:bg-\[#002215\]/g, '');
    
    // Convert hardcoded slate text to semantic colors
    footerContent = footerContent.replace(/text-slate-400/g, 'text-on-primary-container');
    footerContent = footerContent.replace(/text-slate-500/g, 'text-on-primary/60');
    footerContent = footerContent.replace(/text-slate-50/g, 'text-on-primary');
    footerContent = footerContent.replace(/text-slate-200/g, 'text-white');
    
    // Convert hardcoded ambers and specific colors to semantic
    footerContent = footerContent.replace(/text-amber-500/g, 'text-secondary-container');
    footerContent = footerContent.replace(/text-amber-600/g, 'text-secondary');
    footerContent = footerContent.replace(/decoration-amber-600/g, 'decoration-secondary');
    footerContent = footerContent.replace(/border-slate-800/g, 'border-white/10');
    
    // For proposal 1 which has #ffffff and local specific hardcodes:
    footerContent = footerContent.replace(/text-\[#ffffff\]/g, 'text-on-primary');
    footerContent = footerContent.replace(/text-\[#f8f9fa\]\/70/g, 'text-on-primary-container');
    footerContent = footerContent.replace(/bg-white\/10/g, 'bg-white/5');

    // Replace it back
    content = content.replace(footerRegex, footerContent);
    fs.writeFileSync(file, content);
    console.log(`Processed semantic footer for ${file}`);
  }
});
