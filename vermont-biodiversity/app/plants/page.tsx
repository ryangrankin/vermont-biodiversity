import Link from "next/link";
import { plantCategories } from "@/data/studentContent";

export default function PlantsPage() {
  return (
    <main className="container">

      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>Plants & Gardens</h1>

      <p>Discover plants that help Vermont wildlife.</p>


      {/* STUDENT-WRITTEN PLANT INFORMATION */}

      <div className="card-grid">

        {plantCategories.map((category, index) => (
          <div className="info-card" key={index}>

            <h2>{category.title}</h2>

            <p>{category.description}</p>

          </div>
        ))}

      </div>

    </main>
  );
}