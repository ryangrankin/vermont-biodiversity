
import PhotoCredit from "@/app/components/PhotoCredit";
import { photoCredits } from "@/data/photoCredits";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  individualAnimals,
  animalCategories,
  recommendations,
} from "@/data/studentContent";

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

type RecommendationLink = {
  type: string;
  id: string;
  label: string;
};

function getAnimalRecommendations(animalId: string) {
  return recommendations.filter((recommendation) => {
    const linkedRecommendation = recommendation as
      typeof recommendation & {
        learnMore?: RecommendationLink;
        learnMoreLinks?: RecommendationLink[];
      };

    const links = [
      ...(linkedRecommendation.learnMore
        ? [linkedRecommendation.learnMore]
        : []),
      ...(linkedRecommendation.learnMoreLinks ?? []),
    ];

    return links.some(
      (link) =>
        link.type === "animal" &&
        link.id === animalId
    );
  });
}

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
    
<main className={`container animal-category-background animal-bg-${category}`}>
      <Link href="/animals" className="back-link">
        ← Back to Animals
      </Link>

      <h1>{categoryInfo.title}</h1>
      <p>{categoryInfo.description}</p>

      <section className="section">
        <h2>Explore {categoryInfo.title}</h2>

        <div className="info-grid">
          {categoryAnimals.map((animal) => {
            const animalRecommendations =
              getAnimalRecommendations(animal.id);

            return (
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

                <h3>
                  {animal.name ||
                    "Animal Name Coming Soon"}
                </h3>

                <h4>Description</h4>
                <p>{animal.description}</p>

                <h4>Why This Animal Matters</h4>
                <p>{animal.importance}</p>

                

<h4>How People Can Help</h4>
                {animalRecommendations.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <Link
                      href={`/recommendations/animal/${encodeURIComponent(
                        animal.id
                      )}`}
                      className="secondary-button"
                    >
                      See All {animal.name} Recommendations
                      {" "}({animalRecommendations.length})
                    </Link>
                  </div>
                )}

                <h4>Information Sources</h4>

                {"sources" in animal &&
                Array.isArray(animal.sources) &&
                animal.sources.length > 0 ? (
                  <ul className="animal-sources">
                    {animal.sources.map((source, index) => (
                      <li key={`${animal.id}-source-${index}`}>
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
            );
          })}
        </div>
      </section>
    <PhotoCredit {...photoCredits[category as keyof typeof photoCredits]} />
    </main>
  );
}
