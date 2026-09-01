const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('HeroBackground')) {
  content = content.replace(
    'import { PublicNavbar } from "@/components/public-navbar";',
    'import { PublicNavbar } from "@/components/public-navbar";\nimport { HeroBackground } from "@/components/hero-background";'
  );
}

// Replace background
const bgRegex = /<div className="absolute inset-0 z-0">[\s\S]*?<\/div>/;
content = content.replace(bgRegex, '<HeroBackground />');

fs.writeFileSync(file, content);
console.log('patched');
