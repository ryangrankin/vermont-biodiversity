
export const instant = false;

import PhotoCredit from "@/app/components/PhotoCredit";
import { photoCredits } from "@/data/photoCredits";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  plantCategories,
  individualPlants,
  recommendations,
} from "@/data/studentContent";


const categoryPaths = [
  "pollinators",
  "helpful",
  "trees",
];


type PageProps = {
  params: Promise<{ category: string }>;
};


function renderTextWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return parts.map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,;!?]+$/, "");

      return (
        <span key={index}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1769aa",
              textDecoration: "underline",
            }}
          >
            {url}
          </a>
          {part.slice(url.length)}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}


type RecommendationLink = {
  type: string;
  id: string;
  label: string;
};

function getPlantRecommendations(plantId: string) {
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
        link.type === "plant" &&
        link.id === plantId
    );
  });
}

export default async function PlantCategoryPage({
  params,
}: PageProps) {
  const { category } = await params;

  const categoryIndex = categoryPaths.indexOf(category);

  if (
    categoryIndex === -1 ||
    !plantCategories[categoryIndex]
  ) {
    notFound();
  }

  const plantCategory = plantCategories[categoryIndex];

  // Find plants belonging to this category.
 const categoryPlants = individualPlants.filter(
  (plant): plant is typeof plant & { id: string } =>
    plant.category === category &&
    plant.name.trim() !== "" &&
    typeof plant.id === "string" &&
    plant.id.trim() !== ""
);

  // Preserve the existing category backgrounds.
  const backgroundClasses: Record<string, string> = {
    trees: "trees-background",
    pollinators: "pollinators-background",
    helpful: "helpful-background",
  };

  const backgroundClass =
    backgroundClasses[category] ?? "";

  return (
    <main className={`container ${backgroundClass}`}>
      <Link href="/plants" className="back-link">
        ← Back to Plants &amp; Gardens
      </Link>

      <h1>{plantCategory.title}</h1>

      {/* ABOUT THIS CATEGORY */}
      <div className="info-card">
        <h2>About This Category</h2>
        <p>{plantCategory.description}</p>
      </div>

      {/* EXPLORE PLANTS */}
      <section style={{ marginTop: "40px" }}>
        <h2>Explore Plants</h2>

        {categoryPlants.length === 0 ? (
          <div className="empty-state">
            <p>
              The LEGO Club is still researching plants
              for this category. Check back soon!
            </p>
          </div>
        ) : (
          <div className="info-grid">
            {categoryPlants.map((plant) => {
              const plantRecommendations =
                getPlantRecommendations(plant.id);

              return (
                <div
                  className="info-card"
                  key={plant.id}
                  id={plant.id}
                >
                  <h3>{plant.name}</h3>

                  
                {plant.description && (
                  <p>{renderTextWithLinks(plant.description)}</p>
                )}


                  {plant.importance && (
                    <p>
                      <strong>Why It Matters:</strong>{" "}
                      {plant.importance}
                    </p>
                  )}

                  {plant.conservationTip && (
                    <p>
                      <strong>Conservation Tip:</strong>{" "}
                      {plant.conservationTip}
                    </p>
                  )}

                  {plantRecommendations.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <Link
                        href={`/recommendations/plant/${encodeURIComponent(
                          plant.id
                        )}`}
                        className="secondary-button"
                      >
                        See All {plant.name} Recommendations{" "}
                        ({plantRecommendations.length})
                      </Link>
                    </div>
                  )}

                  
{plant.sources?.some(
  (source) => source.name.trim() && source.url.trim()
) && (
  <div className="recommendation-sources">
    <h4>Sources</h4>
    <ul>
      {plant.sources
        .filter(
          (source) =>
            source.name.trim() &&
            /^https?:\/\//i.test(source.url.trim())
        )
        .map((source, index) => (
          <li key={`${source.url}-${index}`}>
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
  </div>
)}

                </div>
              );
            })}
          </div>
        )}
      </section>
    <PhotoCredit {...photoCredits[category as keyof typeof photoCredits]} />
    </main>
  );
}
