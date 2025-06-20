export default function Post1() {
  return (
    <article className="prose lg:prose-xl max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold mb-4">
        Boost Your Next.js Static Site with Instant Search
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        <strong>Published on:</strong> June 20, 2025
      </p>

      <p>
        Adding search functionality to static sites used to be a hassle — either
        you had to rely on external services or deal with clunky JavaScript
        hacks. But with{" "}
        <code className="bg-gray-100 px-1 rounded">next-static-search</code>,
        you can now embed fast, client-side search into your statically exported
        Next.js apps.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Why Pagefind?</h2>
      <p>
        Pagefind is a blazing-fast search library optimized for static HTML. It
        s designed to work without any backend, making it ideal for JAMstack
        workflows.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Simple Setup</h2>
      <p>
        Just install{" "}
        <code className="bg-gray-100 px-1 rounded">next-static-search</code>,
        configure your output folder, and you are ready to go. It seamlessly
        generates a searchable index during build time.
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic mt-6 text-gray-700">
        “Finally, a developer-friendly search solution for static Next.js
        websites!” – Dev Weekly
      </blockquote>
    </article>
  );
}
