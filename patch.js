const fs = require('fs');
const file = 'src/app/actions/event.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('sendBulkEventEmail')) {
  code = code.replace(
    'import { revalidatePath } from "next/cache";',
    'import { revalidatePath } from "next/cache";\nimport { sendBulkEventEmail } from "@/lib/email";'
  );
  
  const insertCode = `
    try {
      const users = await prisma.user.findMany({
        where: { status: "APPROVED" },
        select: { email: true },
      });
      
      const emails = users.map(u => u.email).filter((e): e is string => Boolean(e));
      
      if (emails.length > 0) {
        // ponytail: BCC chunking needed if > 500 users for Gmail limits.
        await sendBulkEventEmail(emails, data.title);
      }
    } catch (error) {
      console.error("Failed to send bulk event email", error);
    }`;

  code = code.replace(
    /createdById: session\.user\.id,\n\s*},\n\s*}\);\n/g,
    match => match + insertCode + '\n'
  );
  
  fs.writeFileSync(file, code);
  console.log('patched');
}
