import Link from "next/link";
import { plantCategories } from "@/data/studentContent";

export default function PlantsPage() {
  return (
    <main className="container">

      {/* ======================================
          BACK TO DASHBOARD
          ====================================== */}

      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      {/* ======================================
          PAGE HEADER
          ====================================== */}

      <h1>Plants & Gardens</h1>

      <p>[STUDENTS: WRITE AN INTRODUCTION TO THIS PAGE]</p>

      {/* ======================================
          PLANT CATEGORIES
          ====================================== */}

      <section className="section">
        <div className="card-grid">

          {plantCategories.map((category, index) => (
            <article className="info-card" key={index}>

              {/* CATEGORY NAME */}
              <h2>{category.title}</h2>

              {/* STUDENT DESCRIPTION */}
              <h3>About This Category</h3>
              <p>{category.description}</p>

              {/* STUDENT CONSERVATION TIP */}
              <h3>How You Can Help</h3>
              <p>{category.conservationTip}</p>

            </article>
          ))}

        </div>
      </section>

    </main>
  );
}