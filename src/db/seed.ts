import { eq } from "drizzle-orm";
import { db } from "./index";
import { profiles } from "./schema";
import slugify from "slugify";

const builders = [
  {
    codeId: 1,
    fullName: "Shiara Arauzo",
    bio: "Construyendo el futuro de la tecnología en Perú.",
    background: "Design Engineer",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 2,
    fullName: "Railly Hugo",
    bio: "Builder apasionado por crear productos tech innovadores.",
    background: "Software Engineer",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 3,
    fullName: "Anthony Cueva",
    bio: "Creando soluciones tecnológicas para problemas reales.",
    background: "Software Engineer",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 4,
    fullName: "Cristian Correa",
    bio: "Desarrollador enfocado en construir productos de impacto.",
    background: "Data Engineer",
    country: "Colombia",
    city: "Bogota",
  },
  {
    codeId: 5,
    fullName: "Ignacio Rueda",
    bio: "Builder tech con pasión por la innovación.",
    background: "Software Engineer",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 6,
    fullName: "Carlos Tarmeno",
    bio: "Construyendo productos que importan.",
    background: "Software Engineer",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 7,
    fullName: "Edward Ramos",
    bio: "Desarrollador creando el ecosistema tech peruano.",
    background: "Software Engineer",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 8,
    fullName: "Liz Riveros",
    bio: "Builder enfocada en crear experiencias digitales únicas.",
    background: "Economist",
    country: "Perú",
    city: "Lima",
  },
  {
    codeId: 9,
    fullName: "Nicolas Vargas",
    bio: "Emprendedor tech construyendo el futuro.",
    background: "Software Engineer",
    country: "Colombia",
    city: "Bogota",
  },
];

async function seed() {
  console.log("Seeding/updating builders...");

  for (const builder of builders) {
    const slug = slugify(builder.fullName, { lower: true, strict: true });

    // Check if profile exists
    const existing = await db.query.profiles.findFirst({
      where: eq(profiles.slug, slug),
    });

    if (existing) {
      // Update codeId for existing profile
      await db
        .update(profiles)
        .set({ codeId: builder.codeId })
        .where(eq(profiles.slug, slug));
      console.log(
        `✓ Updated codeId for: ${builder.fullName} (${builder.codeId})`,
      );
    } else {
      // Insert new profile
      await db.insert(profiles).values({
        clerkUserId: null,
        slug,
        codeId: builder.codeId,
        fullName: builder.fullName,
        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(builder.fullName)}`,
        bio: builder.bio,
        background: builder.background,
        country: builder.country,
        city: builder.city,
        isPublished: true,
      });
      console.log(`✓ Added: ${builder.fullName} (${builder.codeId})`);
    }
  }

  console.log("Done!");
  process.exit(0);
}

seed();
