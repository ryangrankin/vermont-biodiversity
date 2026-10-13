import Link from "next/link";
import { animals } from "@/data/studentContent";

export default function AnimalsPage() {
  return (
    <main className="container">

      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>Vermont Animals</h1>

      <p>Learn about animals living in Vermont.</p>


      {/* STUDENT-WRITTEN ANIMAL INFORMATION */}

      <div className="card-grid">

        {animals.map((animal, index) => (
          <div className="info-card" key={index}>

            <h2>{animal.name}</h2>

            <p>{animal.description}</p>

            <h3>How You Can Help</h3>

            <p>{animal.tip}</p>

          </div>
        ))}

      </div>

    </main>
  );
}