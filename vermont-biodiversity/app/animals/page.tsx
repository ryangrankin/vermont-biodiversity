
import Link from "next/link";
import { animalCategories } from "@/data/studentContent";

const categoryPaths = [
  "mammals",
  "fish",
  "reptiles",
  "amphibians",
  "birds",
  "insects",
];

export default function AnimalsPage() {
  return (
    <main className="container">
      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1>Animals</h1>

      <p>
        Explore the different animal categories
        chosen by the LEGO Club.
      </p>

      <div className="info-grid">
        {animalCategories.map((category, index) => (
          <div className="info-card" key={index}>
            <h2>{category.title}</h2>

            <p>{category.description}</p>

            <Link
              href={`/animals/${categoryPaths[index]}`}
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
