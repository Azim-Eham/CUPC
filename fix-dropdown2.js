const fs = require('fs');
const path = 'src/components/post/post-card.tsx';
let code = fs.readFileSync(path, 'utf8');

// The PostCard component is passing `asChild` to DropdownMenuTrigger which is a Radix convention.
// Since it's using @base-ui/react, we should pass `render={<Button variant="ghost" ... />}` instead of wrapping it.

code = code.replace(
  '<DropdownMenuTrigger asChild>\n                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-50 hover:bg-white/5 rounded-full">\n                    <MoreHorizontal className="h-4 w-4" />\n                  </Button>\n                </DropdownMenuTrigger>',
  '<DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-50 hover:bg-white/5 rounded-full" />}>\n                  <MoreHorizontal className="h-4 w-4" />\n                </DropdownMenuTrigger>'
);

fs.writeFileSync(path, code);
