const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The previous replace left a dangling </div> because the regex wasn't greedy enough for the nested divs.
// Let's replace the whole block carefully.
content = content.replace(
  /{[\s]*\/\* Background Image \*\/[\s]*}\n[\s]*<HeroBackground \/>\n[\s]*<\/div>/m,
  '{/* Background Image */}\n          <HeroBackground />'
);

fs.writeFileSync(file, content);
console.log('fixed');
