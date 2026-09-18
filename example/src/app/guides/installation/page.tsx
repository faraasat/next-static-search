import Link from "next/link";
import { Footer } from "@/components/footer";
import { Search } from "@/components/search";

export const metadata = { title: "Installation" };

export default function Page() {
  return (
    <main className="wrap">
      <p><Link href="/">← Back to the demo</Link></p>
      <h1>Installation</h1>
      <Search />
      <section className="card">
        <p>
          Install the package and its peer dependencies, then add the Pagefind
          CLI as a dev dependency. Pagefind indexes the exported HTML, so it
          runs after the Next.js build rather than during it.
        </p>
        <pre>{`npm install next-static-search
npm install -D pagefind`}</pre>
        <p>
          The component requires React 17 or newer and works with both the App
          Router and the Pages Router, as long as the site is statically
          exported.
        </p>
      </section>
      <Footer />
    </main>
  );
}
