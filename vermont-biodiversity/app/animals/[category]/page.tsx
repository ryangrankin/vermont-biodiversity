
import Link from "next/link";
import { notFound } from "next/navigation";
import { individualAnimals } from "@/data/studentContent";
import { animalCategories } from "@/data/studentContent";


export const instant = false;


const categoryPaths = [
  "mammals",
  "fish",
  "reptiles",
  "amphibians",
  "birds",
  "insects",
];

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function AnimalCategoryPage({
  params,
}: PageProps) {
  const { category } = await params;

  const categoryIndex = categoryPaths.indexOf(category);

  if (categoryIndex === -1) {
    notFound();
  }

  const categoryInfo = animalCategories[categoryIndex];

  const categoryAnimals = individualAnimals.filter(
    (animal) => animal.category === category
  );

  return (
    <main className="container">
      <Link href="/animals" className="back-link">
        ← Back to Animals
      </Link>

      <h1>{categoryInfo.title}</h1>

      <p>{categoryInfo.description}</p>

      <section className="section">
        <h2>How People Can Help</h2>
        <p>{categoryInfo.conservationTip}</p>
      </section>

      <section className="section">
        <h2>Explore {categoryInfo.title}</h2>

        <div className="info-grid">
          {categoryAnimals.map((animal) => (
            <article className="info-card" key={animal.id}>
              <h3>{animal.name || "Animal Name Coming Soon"}</h3>

              <h4>Description</h4>
              <p>{animal.description}</p>

              <h4>Why This Animal Matters</h4>
              <p>{animal.importance}</p>

              <h4>How People Can Help</h4>
              <p>{animal.conservationTip}</p>

              <h4>Information Source</h4>
              <p>{animal.source}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
