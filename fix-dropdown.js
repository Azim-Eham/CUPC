const fs = require('fs');
const path = 'src/components/ui/dropdown-menu.tsx';
let code = fs.readFileSync(path, 'utf8');

// Find DropdownMenuTrigger function
code = code.replace(
  'function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {\n  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />\n}',
  'function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props & { asChild?: boolean }) {\n  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" render={props.asChild ? undefined : <button />} {...props} />\n}'
);

fs.writeFileSync(path, code);
