import Link from "next/link";
import { appInfo } from "@/data/studentContent";

export default function Home() {
  return (
    <main className="container">

      {/* =====================================
          STUDENT APP NAME
          ===================================== */}

      <section className="welcome-section">

        <h1>
          {appInfo.name || "[STUDENTS: APP NAME]"}
        </h1>

        <h2>
          {appInfo.tagline || "[STUDENTS: APP SLOGAN]"}
        </h2>

        <p>
          {appInfo.welcome || "[STUDENTS: WELCOME MESSAGE]"}
        </p>

        <Link href="/survey" className="primary-button">
          Get Started →
        </Link>

      </section>


      {/* =====================================
          STUDENT DESIGN PLACEHOLDER
          ===================================== */}

      <section className="design-placeholder">

        <p>STUDENTS: APP LOGO OR IMAGE</p>

      </section>

    </main>
  );
}