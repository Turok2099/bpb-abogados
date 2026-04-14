const fs = require('fs');
let file = 'app/(marketing)/propuesta-3/page.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('<WhatsAppWrapper />')) {
  content = content.replace('    </div>\n  );\n}', '      <WhatsAppWrapper />\n    </div>\n  );\n}');
  fs.writeFileSync(file, content);
}
