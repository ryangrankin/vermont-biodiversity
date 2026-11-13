
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
        <h2>Explore {categoryInfo.title}</h2>

        
<div className="info-grid">
  {categoryAnimals.map((animal) => (
    <article
      className="info-card"
      key={animal.id}
      id={animal.id}
    >
    

{animal.image && (
  <img
    src={animal.image}
    alt={`Photograph of ${animal.name}`}
    loading="lazy"
    style={{
      height: "220px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "12px",
    }}
  />
)}

<h3>{animal.name}</h3>


      <h3>{animal.name || "Animal Name Coming Soon"}</h3>

      <h4>Description</h4>
      <p>{animal.description}</p>

      <h4>Why This Animal Matters</h4>
      <p>{animal.importance}</p>

      <h4>How People Can Help</h4>
      <p>{animal.conservationTip}</p>

      <h4>Information Sources</h4>

        {"sources" in animal &&
        Array.isArray(animal.sources) &&
        animal.sources.length > 0 ? (
          <ul className="animal-sources">
            {animal.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
              animal.source && <p>{animal.source}</p>
            )}
          </article>
         ))}
        </div>

      </section>
    </main>
  );
}
