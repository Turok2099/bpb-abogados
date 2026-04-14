const fs = require('fs');

const filesToProcess = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/(marketing)/propuesta-1/page.tsx',
  'app/(marketing)/propuesta-2/page.tsx',
  'app/(marketing)/propuesta-3/page.tsx'
];

// Mapping of material icon names to lucide icon names
const iconMap = {
  'gavel': 'Gavel',
  'arrow_forward': 'ArrowRight',
  'home': 'HomeIcon',
  'menu': 'Menu',
  'architecture': 'PencilRuler',
  'corporate_fare': 'Building',
  'precision_manufacturing': 'Crosshair',
  'speed': 'Gauge',
  'location_on': 'MapPin',
  'mail': 'Mail',
  'public': 'Globe',
  'verified_user': 'ShieldCheck',
  'business_center': 'Briefcase',
  'groups': 'Users',
  'balance': 'Scale',
  'rocket_launch': 'Rocket',
  'call': 'Phone',
  'alternate_email': 'AtSign',
  'share': 'Share2',
  'chat': 'MessageCircle',
  'format_quote': 'Quote',
  'work': 'Briefcase',
  'newspaper': 'Newspaper'
};

filesToProcess.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Find all used icons in this file
  const usedIcons = new Set();
  
  // Regex explains: <span className="material-symbols-outlined {classes}"{> {iconName} </span>
  // Note: classes could be empty or span multiple lines. We'll use a robust regex.
  const regex = /<span(?:\s+aria-label=".*?")?\s+className="(?:.*?)material-symbols-outlined(.*?)"(?:.*?)>([\w_]+)<\/span>/g;
  
  let newContent = content.replace(regex, (match, classes, iconName) => {
    let rawClasses = classes.trim();
    const lucideName = iconMap[iconName];
    
    if (!lucideName) {
      console.log(`Missing mapped icon for: ${iconName}`);
      return match;
    }
    
    usedIcons.add(lucideName);
    
    // Lucide react requires classes on the component directly. 
    // We'll map the classes. If there are no extra classes, we just put the component.
    if (rawClasses) {
      return `<${lucideName} className="${rawClasses}" />`;
    } else {
      return `<${lucideName} />`;
    }
  });

  // Inject import statement if icons were used
  if (usedIcons.size > 0 && !newContent.includes('lucide-react')) {
    const importStatement = `import { ${Array.from(usedIcons).join(', ')} } from "lucide-react";\n`;
    newContent = importStatement + newContent;
  }
  
  // Special fix for page.tsx where Link is imported first
  if (usedIcons.size > 0 && file.includes('page.tsx')) {
    newContent = newContent.replace('import {', 'import {'); // Just force re-render if needed
  }

  fs.writeFileSync(file, newContent);
  console.log(`Processed ${file}`);
});
