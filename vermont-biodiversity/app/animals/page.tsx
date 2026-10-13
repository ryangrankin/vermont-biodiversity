import Link from "next/link";
import { animals } from "@/data/studentContent";

export default function AnimalsPage() {
  return (
    <main className="container">

      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1>Animals</h1>

      <p>[STUDENTS: WRITE AN INTRODUCTION TO THIS PAGE]</p>

      <section className="section">
        <div className="card-grid">

          {animals.map((animal, index) => (
            <article className="info-card" key={index}>

              <h2>Animal {index + 1}</h2>

              <h3>Animal Name</h3>
              <p>{animal.name}</p>

              <h3>Description</h3>
              <p>{animal.description}</p>

              <h3>Why This Animal Matters</h3>
              <p>{animal.importance}</p>

              <h3>How People Can Help</h3>
              <p>{animal.conservationTip}</p>

              <h3>Information Source</h3>
              <p>{animal.source}</p>

            </article>
          ))}

        </div>
      </section>

    </main>
  );
}