import Link from "next/link";
import { appInfo, dailyTips } from "@/data/studentContent";

export default function Home() {
  return (
    <main className="container">

      {/* APP INTRODUCTION */}

      <section className="hero">
        <h1>{appInfo.name}</h1>

        <p>{appInfo.tagline}</p>

        <p>{appInfo.welcome}</p>
      </section>


      {/* MAIN NAVIGATION */}

      <section className="navigation-grid">

        <Link href="/animals" className="nav-card">
          <h2>Animals</h2>
          <p>Learn about Vermont wildlife.</p>
        </Link>

        <Link href="/plants" className="nav-card">
          <h2>Plants & Gardens</h2>
          <p>Learn about Vermont plants.</p>
        </Link>

        <Link href="/wildlife-cam" className="nav-card">
          <h2>Wildlife Cam</h2>
          <p>Explore wildlife photographs.</p>
        </Link>

      </section>


      {/* DAILY RECOMMENDATIONS */}

      <section className="section">

        <h2>Biodiversity Tips</h2>

        <div className="card-grid">

          {dailyTips.map((tip, index) => (
            <div className="info-card" key={index}>

              <h3>{tip.title}</h3>

              <p>{tip.description}</p>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}