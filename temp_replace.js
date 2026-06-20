const fs = require('fs');
const file = 'C:/Users/Admin/OneDrive/Desktop/Plateup/components/contact/ContactForm.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="text-[0.9375rem] font-medium text-[var(--color-on-surface-variant)] py-2">
            {defaultEmail}
          </div>`;

const replacement = `<Input 
            id="email"
            name="email"
            type="email" 
            value={defaultEmail}
            readOnly
            className="h-12 bg-[var(--color-surface-variant)]/30 border-[var(--color-outline-variant)]/50 text-[var(--color-on-surface-variant)] rounded-xl opacity-90 cursor-not-allowed focus-visible:ring-0 select-none"
            tabIndex={-1}
            aria-readonly="true"
          />`;

content = content.replace(target, replacement);
// also handle \r\n if needed
content = content.replace(target.replace(/\n/g, '\r\n'), replacement);

fs.writeFileSync(file, content);
console.log("Done");
