const fs = require('fs');
const file = 'C:/Users/Admin/OneDrive/Desktop/Plateup/components/contact/ContactForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove noValidate
content = content.replace(/<form onSubmit=\{handleSubmit\} className="space-y-8" noValidate>/g, '<form onSubmit={handleSubmit} className="space-y-8">');

// add validation to handleSubmit
const targetHandleSubmit = `    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessage(formData);`;

const replacementHandleSubmit = `    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    if (!email || !String(email).includes('@')) {
      setError('Please provide a valid email address.');
      setLoading(false);
      return;
    }
    const res = await submitContactMessage(formData);`;

content = content.replace(targetHandleSubmit, replacementHandleSubmit);
content = content.replace(targetHandleSubmit.replace(/\n/g, '\r\n'), replacementHandleSubmit);

fs.writeFileSync(file, content);
console.log("Done");
