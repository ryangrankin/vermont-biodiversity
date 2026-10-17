
import Link from "next/link";
import { plantCategories } from "../../data/studentContent";

const categoryPaths = [
  "pollinators",
  "helpful",
  "trees",
  "wildlife",
];

export default function PlantsPage() {
  return (
    <main className="container">
      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1>Plants & Gardens</h1>

      <p>
        Explore the different plant and garden categories
        chosen by the LEGO Club.
      </p>

      <div className="info-grid">
        {plantCategories.map((category, index) => (
          <div className="info-card" key={index}>
            <h2>{category.title}</h2>

            <p>{category.description}</p>

            <Link
              href={`/plants/${categoryPaths[index]}`}
              className="secondary-button"
            >
              Explore Category →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
