import Link from "next/link";
import Image from "next/image";
import { wildlifeContent } from "@/data/studentContent";

export default function WildlifePage() {
  return (
    <main className="container">

      {/* BACK TO DASHBOARD */}

      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      {/* PAGE HEADER */}

      <h1>Wildlife Cam</h1>

      <p>[STUDENTS: WRITE AN INTRODUCTION TO THIS PAGE]</p>

      {/* WILDLIFE ENTRIES */}

      <section className="section">
        <div className="card-grid">

          {wildlifeContent.map((wildlife, index) => (
            <article className="info-card" key={index}>

              {/* IMAGE OR IMAGE PLACEHOLDER */}

              {wildlife.image ? (
                <Image
                  src={wildlife.image}
                  alt={wildlife.title}
                  width={400}
                  height={250}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div className="wildlife-image-placeholder">
                  [STUDENTS: CHOOSE A WILDLIFE IMAGE]
                </div>
              )}

              {/* STUDENT TITLE */}

              <h2>{wildlife.title}</h2>

              {/* STUDENT DESCRIPTION */}

              <h3>About This Wildlife</h3>
              <p>{wildlife.description}</p>

              {/* STUDENT SOURCE */}

              <h3>Image / Information Source</h3>
              <p>{wildlife.source}</p>

            </article>
          ))}

        </div>
      </section>

    </main>
  );
}