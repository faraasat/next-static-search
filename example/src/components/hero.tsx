export function Hero() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <header className="hero">
      <img src={`${base}/banner.svg`} alt="next-static-search" />
      <h1>next-static-search</h1>
      <p>Instant, offline, zero-backend search for statically exported Next.js sites.</p>
      <nav className="links">
        <a href="https://www.npmjs.com/package/next-static-search">npm</a>
        <a href="https://github.com/faraasat/next-static-search">GitHub</a>
        <a href="https://github.com/faraasat/next-static-search#readme">Docs</a>
      </nav>
    </header>
  );
}
