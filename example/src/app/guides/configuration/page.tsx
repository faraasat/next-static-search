import Link from "next/link";
import { Footer } from "@/components/footer";
import { Code } from "@/components/code";
import { Search } from "@/components/search";

export const metadata = { title: "Configuration" };

export default function Page() {
  return (
    <main className="wrap">
      <p><Link href="/">← Back to the demo</Link></p>
      <h1>Configuration</h1>
      <Search />
      <section className="card">
        <p>
          Every option is optional. The search box renders as a modal by
          default; set <code>searchBoxType</code> to <code>inline</code> to
          render results directly beneath the input instead.
        </p>
        <Code language="tsx">{`<NextStaticSearch
  searchBoxType="inline"
  placeholder="Search the docs"
  pagesToIgnore={["404", "500"]}
  pagefindPath="/docs/_next/static/pagefind/pagefind.js"
/>`}</Code>
        <p>
          Use <code>pagefindPath</code> whenever the site is served under a
          base path, such as a project site on GitHub Pages.
        </p>
      </section>
      <Footer />
    </main>
  );
}
