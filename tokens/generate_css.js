const fs = require('fs');

function generateCSS() {
    console.log("Starting CSS variable generation...");

    // 1. Read files
    const colorRaw = fs.readFileSync('color_tokens.json', 'utf8');
    const typographyRaw = fs.readFileSync('design-tokens.tokens.json', 'utf8');
    let spacingRaw = fs.readFileSync('design-tokens.tokens.json(spacing)', 'utf8');

    // Fix spacing JSON using regex because it contains syntax errors (e.g., missing braces around extensions)
    let spacingData = {};
    const spacingRegex = /"(space-\d+)":\s*\{\s*"type":\s*"dimension",\s*"value":\s*(\d+)/g;
    let match;
    while ((match = spacingRegex.exec(spacingRaw)) !== null) {
        spacingData[match[1]] = { value: parseInt(match[2], 10), type: 'dimension' };
    }

    const colorData = JSON.parse(colorRaw);
    const typographyData = JSON.parse(typographyRaw);

    let css = ':root {\n';

    // 2. Process Spacing
    if (Object.keys(spacingData).length > 0) {
        css += '  /* Spacing */\n';
        for (const [key, obj] of Object.entries(spacingData)) {
            let unit = obj.type === 'dimension' && obj.value !== 0 ? 'px' : '';
            css += `  --${key}: ${obj.value}${unit};\n`;
        }
    }

    // 3. Process Typography
    css += '\n  /* Typography */\n';
    const processTypography = (obj, prefix) => {
        for (const [key, val] of Object.entries(obj)) {
            if (key === 'extensions') continue;
            
            const cleanKey = key.replace(/\s+/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
            let nextPrefix = prefix ? `${prefix}-${cleanKey}` : cleanKey;
            
            // Clean up repeated words like display-display-large -> display-large
            nextPrefix = nextPrefix.replace(/-([a-z0-9]+)-\1-/g, '-$1-');
            // Clean up at the end of string like title-title -> title
            nextPrefix = nextPrefix.replace(/-([a-z0-9]+)-\1$/g, '-$1');

            if (val && val.value !== undefined) {
                let value = val.value;
                let unit = '';
                if (val.type === 'dimension' && value !== 0) unit = 'px';
                if (key === 'fontFamily' && typeof value === 'string' && value.includes(' ')) {
                    value = `"${value}"`;
                }
                css += `  --${nextPrefix}: ${value}${unit};\n`;
            } else if (typeof val === 'object' && val !== null) {
                processTypography(val, nextPrefix);
            }
        }
    };

    if (typographyData.typography) {
        processTypography(typographyData.typography, 'typography');
    }

    // 4. Process Colors
    const resolveColor = (value, data) => {
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const path = value.slice(1, -1).split('.');
            let current = data;
            for (const key of path) {
                if (current[key] !== undefined) {
                    current = current[key];
                } else {
                    // Try case-insensitive match
                    const lowerKey = key.toLowerCase();
                    const matchingKey = Object.keys(current).find(k => k.toLowerCase() === lowerKey);
                    if (matchingKey) {
                        current = current[matchingKey];
                    } else if (!isNaN(Number(key))) {
                        // Fallback: find nearest numeric key
                        const targetNum = Number(key);
                        const numericKeys = Object.keys(current).filter(k => !isNaN(Number(k))).map(Number);
                        if (numericKeys.length > 0) {
                            const closest = numericKeys.reduce((prev, curr) => Math.abs(curr - targetNum) < Math.abs(prev - targetNum) ? curr : prev);
                            current = current[String(closest)];
                        } else {
                            console.warn(`Could not resolve color path: ${value} (failed at ${key})`);
                            return value;
                        }
                    } else {
                        console.warn(`Could not resolve color path: ${value} (failed at ${key})`);
                        return value;
                    }
                }
            }
            return current;
        }
        return value;
    };

    if (colorData.color && colorData.color.role) {
        css += '\n  /* Colors - Light Mode */\n';
        const lightRoles = colorData.color.role.light;
        for (const [key, value] of Object.entries(lightRoles)) {
            const resolved = resolveColor(value, colorData);
            const cssKey = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            css += `  ${cssKey}: ${resolved};\n`;
        }
        css += '}\n';

        css += '\n/* Colors - Dark Mode */\n';
        css += '[data-theme="dark"], .dark {\n';
        const darkRoles = colorData.color.role.dark;
        for (const [key, value] of Object.entries(darkRoles)) {
            const resolved = resolveColor(value, colorData);
            const cssKey = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            css += `  ${cssKey}: ${resolved};\n`;
        }
        css += '}\n';
    } else {
        css += '}\n';
    }

    fs.writeFileSync('tokens.css', css);
    console.log('Successfully generated tokens.css!');
}

generateCSS();
