import Link from "next/link";
import { Footer } from "@/components/footer";
import { Search } from "@/components/search";

export const metadata = { title: "Styling" };

export default function Page() {
  return (
    <main className="wrap">
      <p><Link href="/">← Back to the demo</Link></p>
      <h1>Styling</h1>
      <Search />
      <section className="card">
        <p>
          The stylesheet is published separately so you can skip it entirely and
          write your own. Import it once, near your root layout.
        </p>
        <pre>{`import "next-static-search/style.css";`}</pre>
        <p>
          Every element carries an <code>rstse__</code> prefixed class name, and
          the outer search box also accepts a <code>searchClassName</code> prop
          for scoping your own overrides.
        </p>
      </section>
      <Footer />
    </main>
  );
}
