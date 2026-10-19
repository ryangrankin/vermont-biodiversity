
export const instant = false;

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  plantCategories,
  individualPlants,
} from "../../../data/studentContent";

const categoryPaths = [
  "pollinators",
  "helpful",
  "trees",
  "wildlife",
  "rewilding",
];

type PageProps = {
  params: Promise<{ category: string }>;
};

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
    (plant) =>
      plant.category === category &&
      plant.name.trim() !== ""
  );

  return (
    <main className="container">
      <Link href="/plants" className="back-link">
        ← Back to Plants & Gardens
      </Link>

      <h1>{plantCategory.title}</h1>

      <div className="info-card">
        <h2>About This Category</h2>
        <p>{plantCategory.description}</p>
      </div>

      <div className="info-card">
        <h2>Conservation Tips</h2>
        <p>{plantCategory.conservationTip}</p>
      </div>

      <section style={{ marginTop: "40px" }}>
        <h2>Explore Plants</h2>

        {categoryPlants.length === 0 ? (
          <div className="empty-state">
            <p>
              The LEGO Club is still researching
              plants for this category. Check back
              soon!
            </p>
          </div>
        ) : (
          <div className="info-grid">
            {categoryPlants.map((plant) => (
              <div className="info-card" key={plant.id}>
                <h3>{plant.name}</h3>

                {plant.description && (
                  <p>{plant.description}</p>
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

                {plant.source && (
                  <p>
                    <strong>Source:</strong>{" "}
                    {plant.source}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
