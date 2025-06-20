import Link from "next/link";

export default function Home() {
  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col py-10 container">
        <h1 className="text-4xl">Whats this about??</h1>
        <p>Its about static search -----</p>
        <div className="text-[200px]">🤙</div>
        <div className="mt-3 flex items-center justify-center gap-5">
          <Link
            href="/posts/instant-search"
            className="bg-blue-500 rounded-md py-3 px-5 text-white"
          >
            How its an Instant Search
          </Link>
          <Link
            href="/posts/search-without-backend"
            className="bg-amber-500 rounded-md py-3 px-5 text-white"
          >
            Search Without Backend
          </Link>
        </div>
      </div>
    </section>
  );
}
