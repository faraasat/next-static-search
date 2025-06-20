export default function Post2() {
  return (
    <article className="prose lg:prose-xl max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold mb-4">
        How to Add Full-Text Search to Your Blog Without a Backend
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        <strong>Published on:</strong> June 19, 2025
      </p>

      <p>
        Whether you are building a portfolio, a tech blog, or a documentation
        site, search is crucial. But setting up Algolia or ElasticSearch can be
        overkill for simple static websites.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Meet next-static-search</h2>
      <p>
        <code className="bg-gray-100 px-1 rounded">next-static-search</code> is
        a minimal, no-API solution built on{" "}
        <a
          href="https://pagefind.app"
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          Pagefind
        </a>
        . It indexes your static content and gives you blazing-fast full-text
        search in the browser.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Zero Vendor Lock-in</h2>
      <p>
        Everything is built during your export. No vendor costs, no API keys, no
        data leaving your site. Just pure static goodness.
      </p>

      <ul className="list-disc ml-6 mt-4">
        <li>
          ✅ Works with Next.js{" "}
          <code className="bg-gray-100 px-1 rounded">export</code>
        </li>
        <li>⚡ Zero runtime JS costs</li>
        <li>🧩 Easy to integrate with custom UI</li>
      </ul>
    </article>
  );
}
