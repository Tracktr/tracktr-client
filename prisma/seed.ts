import { prisma } from "utils/prisma";
import languages from "./seed/languages.json";

async function main() {
  const data: any = await languages;

  const convertedData = data.map((item: any) => ({
    englishName: item.english_name,
    iso_639_1: item.iso_639_1,
    name: item.name,
  }));

  await prisma.languages.createMany({
    skipDuplicates: true,
    data: convertedData,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
