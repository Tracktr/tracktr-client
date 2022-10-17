import { PrismaClient } from "@prisma/client";
import languages from "./seed/languages.json";

const prisma = new PrismaClient();

async function main() {
  const data: any = await languages;

  const convertedData = data.map((item: any) => ({
    englishName: item.english_name,
    iso_639_1: item.iso_639_1,
    name: item.name,
  }));

  const language = await prisma.languages.createMany({
    skipDuplicates: true,
    data: convertedData,
  });

  console.log({ language });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
