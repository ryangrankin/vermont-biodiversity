import Link from "next/link";
import { wildlifePhotos } from "@/data/studentContent";

export default function WildlifeCamPage() {
  return (
    <main className="container">

      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>Wildlife Cam</h1>

      <p>Explore wildlife from around Vermont!</p>


      {/* STUDENTS: WILDLIFE PHOTOS WILL GO HERE */}

      <div className="card-grid">

        {wildlifePhotos.map((photo, index) => (
          <div className="info-card" key={index}>

            <div className="photo-placeholder">
              Photo Coming Soon
            </div>

            <h2>{photo.title}</h2>

            <p>{photo.description}</p>

          </div>
        ))}

      </div>

    </main>
  );
}