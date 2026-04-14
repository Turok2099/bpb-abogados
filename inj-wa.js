const fs = require('fs');
const f = 'app/(marketing)/propuesta-1/page.tsx';
let content = fs.readFileSync(f, 'utf8');
if (!content.includes('WhatsAppWrapper')) {
  content = content.replace('import "./theme.css";', 'import { WhatsAppWrapper } from "../../../components/WhatsAppWrapper";\nimport "./theme.css";');
  content = content.replace('      </main>', '      </main>\n      <WhatsAppWrapper />');
}
fs.writeFileSync(f, content);
