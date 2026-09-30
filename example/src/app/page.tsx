import Link from "next/link";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { Code } from "@/components/code";
import { Search } from "@/components/search";

export default function Home() {
  return (
    <main className="wrap">
      <Hero />

      <section className="card">
        <h2>Try it</h2>
        <p className="sub">
          Search the three guide pages of this demo. Press <code>⌘K</code> /{" "}
          <code>Ctrl K</code>, or type below. The index is built by the Pagefind
          CLI after <code>next build</code> — it is a static file, so there is
          no server involved.
        </p>
        <Search />
        <p className="sub" style={{ marginTop: 16 }}>
          Try <code>install</code>, <code>styling</code> or <code>config</code>.
        </p>
      </section>

      <section className="card">
        <h2>Pages in this demo</h2>
        <ul>
          <li><Link href="/guides/installation/">Installation</Link></li>
          <li><Link href="/guides/configuration/">Configuration</Link></li>
          <li><Link href="/guides/styling/">Styling</Link></li>
        </ul>
      </section>

      <section className="card">
        <h2>Usage</h2>
        <Code language="tsx">{`import { NextStaticSearch } from "next-static-search";
import "next-static-search/style.css";

export function Nav() {
  return <NextStaticSearch searchBoxType="modal" />;
}`}</Code>
        <p className="sub" style={{ marginTop: 16 }}>
          Then index the export, after <code>next build</code>:
        </p>
        <Code language="tsx">{`npx pagefind --site out --output-path out/_next/static/pagefind`}</Code>
      </section>

      <Footer />
    </main>
  );
}
